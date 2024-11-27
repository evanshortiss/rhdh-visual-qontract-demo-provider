# Red Hat Developer Hub Demo: Visual Qontract Server

A Node.js server that hosts customisations for Red Hat Developer Hub homepage. Specifically, it responds with data required to power the [backstage-plugin-visual-qontract](https://github.com/RedHatInsights/backstage-plugin-visual-qontract) plugin.

## Usage

Deploy the *rhdh-visual-qontract-provider* using the _k8s/manifests.yaml_ in
the same namespace as your Red Hat Developer Hub instance:

```bash
oc apply -f k8s/manifests.yaml -n $NAMESPACE
```

Add the following entries in the `proxy` configuration for your Red Hat Developer Hub:

```yaml
proxy:
  endpoints:
    /developer-hub:
      credentials: dangerously-allow-unauthenticated
      pathRewrite:
        ^/api/proxy/developer-hub: /resources/json/homepage.json
      target: 'http://rhdh-visual-qontract-provider:8080'
    /inscope-resources:
      changeOrigin: true
      credentials: dangerously-allow-unauthenticated
      secure: false
      target: 'http://rhdh-visual-qontract-provider:8080'
    /status:
      changeOrigin: true
      credentials: dangerously-allow-unauthenticated
      secure: false
      target: 'http://rhdh-visual-qontract-provider:8080/status'
```

And add the following to your plugins configuration (make sure to get the latest SHA value from [backstage-plugin-visual-qontract/releases](https://github.com/evanshortiss/backstage-plugin-visual-qontract/releases/tag/dev):

```yaml
- disabled: false
  integrity: sha256-FON+jcCWWBjHBL2TsKrrSstmJhnoiscom761iFWMseg=
  package: >-
    https://github.com/evanshortiss/backstage-plugin-visual-qontract/releases/download/dev/redhatinsights-backstage-plugin-visual-qontract-1.4.7.tgz
  pluginConfig:
    dynamicPlugins:
      frontend:
        redhatinsights.backstage-plugin-visual-qontract:
          dynamicRoutes:
            - importName: EntityQontractHomePageComponent
              path: /
            - importName: EntityQontractNewsComponent
              menuItem:
                icon: techdocs
                text: News
              path: /news
          mountPoints:
            - config:
                if:
                  allOf:
                    - isType: application
                layout:
                  gridColumnEnd:
                    lg: span 4
                    md: span 6
                    xs: span 12
              importName: EntityQontractNamespacesContent
              mountPoint: entity.page.overview/cards
            - config:
                if:
                  allOf:
                    - isType: application
                layout:
                  gridColumnEnd:
                    lg: span 4
                    md: span 6
                    xs: span 12
              importName: EntityQontractPipelinesComponent
              mountPoint: entity.page.overview/cards
            - config:
                if:
                  allOf:
                    - isType: application
                layout:
                  gridColumnEnd:
                    lg: span 4
                    md: span 6
                    xs: span 12
              importName: EntityQontractCodeComponentsContent
              mountPoint: entity.page.overview/cards
            - config:
                if:
                  allOf:
                    - isType: application
                layout:
                  gridColumnEnd:
                    lg: span 4
                    md: span 6
                    xs: span 12
              importName: EntityQontractEscalationPolicyComponent
              mountPoint: entity.page.overview/cards
            - config:
                if:
                  allOf:
                    - isType: application
                layout:
                  gridColumnEnd:
                    lg: span 4
                    md: span 6
                    xs: span 12
              importName: EntityQontractDependenciesContent
              mountPoint: entity.page.overview/cards
            - config:
                if:
                  allOf:
                    - isType: application
                layout:
                  gridColumnEnd:
                    lg: span 6
                    md: span 6
                    xs: span 12
              importName: EntityQontractSLOComponent
              mountPoint: entity.page.overview/cards
```
