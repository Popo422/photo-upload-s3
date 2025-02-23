#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PhotoUploadZernieStack } from '../lib/photo-upload-zernie-stack';


const app = new cdk.App();
new PhotoUploadZernieStack(app, 'PhotoUploadZernieStack', {
});


app.synth()