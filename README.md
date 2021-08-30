# AWS-CRONS
A simple wrapper for creating cronjobs or scheduled task using `AWS-CDK`

# Features 
- Simple
- Lambda based cron support
- ECS based scheduled tasks
- Log groups support for ECS based crons
- Monitoring using [HealthChecks.io](https://healthchecks.io) (Coming soon)
- Typescript support

# Examples

## Create a Lambda function based cron

```ts
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Schedule } from "@aws-cdk/aws-events";
import { createLambdaCron } from 'aws-crons';

export class CronCdkStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        // Create or search an existing VPC
        const vpc = ec2.Vpc.fromLookup(this, 'dev', {
            vpcId: <vpcId>,
        });

        createLambdaCron({
            this,               // your CDK stack
            vpc,                // VPC to deploy
            'my_Lambda_cron',   // unique ID for CDK to identify your resource,
            lambdaProps: {      // Configurations for lambda function
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromAsset('path_to_lambda_code_directory'),
                handler: 'index.handler',
                environment: {
                    NODE_ENV: 'production',
                    SECRET: 'SSHHHH!!!'
                }
            },
            eventRuleProps: {       // Event trigger config
                schedule: Schedule.expression('rate(10 minutes)'),
                ruleName: 'my_lambda_rule'
            }
        });
    }   
}
```

## Create a Lambda function based cron
```ts
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Schedule } from "@aws-cdk/aws-events";
import { ContainerImage } from '@aws-cdk/aws-ecs';
import { createFargateCron } from 'aws-crons';

export class CronCdkStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        // Create or search an existing VPC
        const vpc = ec2.Vpc.fromLookup(this, 'dev', {
        vpcId: <vpcId>,
        });

        const cluster = new ecs.Cluster(this, 'CronCluster', { vpc });

        createFargateCron({
            this,               // your CDK stack
            cluster,                // VPC to deploy
            'my_fargate_cron',   // unique ID for CDK to identify your resource,
            schedule: Schedule.expression('rate(10 minutes)'),
            containerOption: {
                image: ContainerImage.fromAsset('path_to_dockerfile'),
                environment: {
                    // environment variables to be injected into docker container
                    CLEANUP_ACTION: 'all'
                },
            }
        });
    }   
}
```

### If you found the project helpful please consider giving it a start over [github](https://github.com/pkspyder007/aws-crons) and sharing over twitter. My twitter handle [pkspyder007](https://twitter.com/pkspyder007)

For any queries or suggestion please reach out to me you can find my contact over [here](https://praveeen.in/#contact)
or open an issue or pull request on the repository [pkspyder007/aws-cron](https://github.com/pkspyder007/aws-crons)

