# ACM-AWS

### Description
This repo is the infrastructure and system that ACM uses to provision Students with an AWS account so they can have a proper development environment, access to AWS resources, and a sandbox to deploy/test their systems and projects.

#### NPM commands

`npm run build-lambdas` - Compiles and builds all lambda code and puts it into build-artifacts/
`npm run build-lambdas-<name>` - Compiles and builds an individual lambda's code and puts it into build-artifacts/lambda-folder-name/
`npm run deploy-infrastructure` - Compiles and builds all the code and DEPLOYS only the infrastructure cloudformation stack.
`npm run deploy-acm-frontend` - Compiles and builds all the code and DEPLOYS only the client-code cloudformation stack.
