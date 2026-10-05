terraform {
  required_version = ">= 1.9.0, < 2.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Emulation only: no real AWS credentials or configurable remote endpoints.
provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
  endpoints {
    ec2 = "http://127.0.0.1:4566"
    sts = "http://127.0.0.1:4566"
  }
}

resource "aws_vpc" "lab" {
  cidr_block           = "10.42.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name    = "cloudshield-lab"
    Project = "CloudShield"
  }
}

resource "aws_subnet" "private" {
  vpc_id                  = aws_vpc.lab.id
  cidr_block              = "10.42.1.0/24"
  map_public_ip_on_launch = false
  tags = {
    Name = "cloudshield-private"
  }
}

output "vpc_id" {
  description = "Emulated VPC ID (not connected to Kind)."
  value       = aws_vpc.lab.id
}

output "subnet_id" {
  description = "Emulated private subnet ID."
  value       = aws_subnet.private.id
}
