import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import { Stack } from '@aws-cdk/core';
import { IVpc, Vpc } from '@aws-cdk/aws-ec2';

interface ILambdaCron {
  stack: Stack;
  vpc?: IVpc | Vpc;
  id: string;
  lambdaProps: lambda.FunctionProps;
  eventRuleProps: events.RuleProps;
}

export const createLambdaCron = ({
  stack,
  vpc,
  id,
  lambdaProps,
  eventRuleProps,
}: ILambdaCron): void => {
  try {
    const newLambda = new lambda.Function(stack, id, { vpc, ...lambdaProps });
    const newEventRule = new events.Rule(stack, `${id}_rule`, {
      ...eventRuleProps,
    });
    newEventRule.addTarget(new targets.LambdaFunction(newLambda));
  } catch (error) {
    console.error(error);
    throw new Error('Something went wrong while creating lambda cron...');
  }
};
