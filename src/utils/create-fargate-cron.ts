import {
  FargateTaskDefinition,
  Cluster,
  Volume,
  ContainerDefinitionOptions,
  MountPoint,
  ICluster,
} from '@aws-cdk/aws-ecs';
import {
  ScheduledEc2TaskDefinitionOptions,
  ScheduledFargateTask,
} from '@aws-cdk/aws-ecs-patterns';
import { Schedule } from '@aws-cdk/aws-events';
import { Stack, RemovalPolicy } from '@aws-cdk/core';
import { createLogDriver, createLogGroup, createCron } from './resources';

interface IFargateTask {
  stack: Stack;
  cluster: Cluster |ICluster;
  id: string;
  scheduledFargateTaskDefinitionOptions?: ScheduledEc2TaskDefinitionOptions;
  schedule: Schedule;
  efsVolume?: Volume;
  mountPoint?: MountPoint;
  containerOptions: ContainerDefinitionOptions;
}

export const createFargateCron = ({
  stack,
  cluster,
  id,
  schedule,
  containerOptions,
  efsVolume,
  mountPoint,
}: IFargateTask): ScheduledFargateTask => {
  const logDriver = createLogDriver({
    streamPrefix: id,
    logGroup: createLogGroup(stack, `${id}_logs`, {
      logGroupName: `${id}_logs`,
      removalPolicy: RemovalPolicy.SNAPSHOT,
    }),
  });

  const ftd = new FargateTaskDefinition(stack, `${id}_task`, {});

  if (efsVolume) {
    ftd.addVolume({
      ...efsVolume,
    });
    if (!mountPoint) {
      throw new Error(
        'You must specify mount points for your EFS volume. \n mointPoints missing while efsVolume present'
      );
    }
  }

  const container = ftd.addContainer(`${id}_container`, {
    logging: logDriver,
    ...containerOptions,
  });

  if (mountPoint) {
    container.addMountPoints({
      ...mountPoint,
    });
  }

  return createCron(stack, `${id}_cron`, {
    cluster,
    scheduledFargateTaskDefinitionOptions: {
      taskDefinition: ftd,
    },
    schedule,
  });
};
