# kind Cluster Setup

This setup provisions a lightweight multi-node Kubernetes cluster locally using kind.

The cluster is designed to simulate production-oriented Kubernetes behaviors such as:

- workload scheduling across nodes
- ingress traffic routing
- observability tooling
- autoscaling experiments
- failure simulations

## Why kind?
Because its what came to my mind at start but also becasue kind provides a fast and reproducible local Kubernetes environment using Docker containers as nodes.

This makes it useful for:
- Platform experiments
- CI testing
- Kubernetes debugging 
- infrastructure simulations (stimulates prod or stage env )

## Cluster Topology

- 1 control-plane node
- 2 worker nodes

## Create Cluster

```bash
kind create cluster --name engineering-lab --config config.yml


To install Kind or to Know more about kind 
refer  https://kind.sigs.k8s.io/docs/user/quick-start/
but first install docker or podman cause kind uses containers to run kubernetes nodes.
