# RHDH Customisation Server

A sample Node.js server that hosts customisations for Red Hat Developer Hub.

## Deployment

A set of sample YAML manifests are included in this repository to get the
server up and running quickly. 

Use the the `oc` or `kubectl` binary to deploy these in the same project
or namespace as your Developer Hub instance:

```bash
oc apply -f k8s/manifests.yaml -n $RHDH_PROJECT_NS
```

Next, update the Red Hat Developer Hub configuration to use the deployed
customisation server by adding to the `proxy` configuration key. Typically
this involves updating the *app-config-rhdh.yaml* that contains your custom
configurations for your Red Hat Developer Hub instance:

```yaml
data:
  app-config-rhdh.yaml: |
    proxy:
      endpoints:
        # Add the proxied endpoint for homepage quick links
        '/developer-hub':
          # Rewrite requests from the UI to the /developer-hub endpoint to the
          # RHDH backend API, and fulfill them using the base path (/) from the
          # customisation server in the same namespace
          target: http://rhdh-customisation-server:8080
          pathRewrite:
            '^/api/proxy/developer-hub': /
          changeOrigin: true
```

## Configuration

Currently, this server has the ability to serve custom "Quick Access" links
to an instance of Red Hat Developer Hub.

### Homepage "Quick Access" Links

These are the links displayed on the home page of Red Hat Developer Hub. By
default, this server will use the links defined in */data/home.json*.

To define a set of custom links, edit the *home.json* entry in the example
*rhdh-homepage-data* ConfigMap.
