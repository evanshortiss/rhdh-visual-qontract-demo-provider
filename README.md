# RHDH Customisation Server

A sample Node.js server that hosts customisations for Red Hat Developer Hub. 

The Red Hat Developer Hub Documentation includes more information about
supported customisations:

* [Home Page](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.2/html/getting_started_with_red_hat_developer_hub/proc-customize-rhdh-homepage_rhdh-getting-started#proc-customize-rhdh-homepage_rhdh-getting-started)
* [Tech Radar](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.2/html/getting_started_with_red_hat_developer_hub/proc-customize-rhdh-tech-radar-page_rhdh-getting-started)
* [Learning Paths](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.2/html/getting_started_with_red_hat_developer_hub/proc-customize-rhdh-learning-paths_rhdh-getting-started)

## Deployment

A set of sample YAML manifests are included in this repository to get the
server up and running quickly. Use the the `oc` or `kubectl` binary to deploy
these in the same project or namespace as your Developer Hub instance:

```bash
oc apply -f k8s/manifests.yaml -n $RHDH_PROJECT_NS
```

Next, update the Red Hat Developer Hub configuration to use the deployed
customisation server, by adding to the `proxy` configuration key to your Red
Hat Developer Hub custom configuration. Typically this involves updating the
*app-config-rhdh.yaml* that's stored in the *app-config-rhdh* ConfigMap.

> [!NOTE]
> The Red Hat Developer Hub documentation contains a guide on [how to create the *app-config-rhdh* ConfigMap](https://docs.redhat.com/en/documentation/red_hat_developer_hub/1.2/html/administration_guide_for_red_hat_developer_hub/assembly-add-custom-app-file-openshift_admin-rhdh).

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
