import { AwsLogDriverProps, AwsLogDriver } from '@aws-cdk/aws-ecs';
import {
  ScheduledFargateTask,
  ScheduledFargateTaskProps,
} from '@aws-cdk/aws-ecs-patterns';
import { ILogGroup, LogGroup, LogGroupProps } from '@aws-cdk/aws-logs';
import { Stack } from '@aws-cdk/core';

export const getLogGroupFromArn = (
  stack: Stack,
  id: string,
  arn: string
): ILogGroup => {
  return LogGroup.fromLogGroupArn(stack, id, arn);
};

export const createLogGroup = (
  stack: Stack,
  id: string,
  props: LogGroupProps
): LogGroup => {
  return new LogGroup(stack, id, props);
};

export const createLogDriver = (props: AwsLogDriverProps): AwsLogDriver => {
  return new AwsLogDriver(props);
};

export const createCron = (
  stack: Stack,
  id: string,
  taskDefinition: ScheduledFargateTaskProps
): ScheduledFargateTask => {
  return new ScheduledFargateTask(stack, id, taskDefinition);
};
