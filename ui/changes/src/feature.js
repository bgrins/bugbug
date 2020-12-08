import ApexCharts from "apexcharts";
import { componentConnections, setupOptionsObject } from "./common";

let FEATURES = {
  search: ["Firefox::Search"],
};

let { getOption, setOption, getOptionType } = setupOptionsObject(
  {
    feature: {
      value: null,
      type: "select",
    },
  },
  function onchange() {
    rerender();
  }
);

async function rerender() {
  let connections = await componentConnections;
  console.log(connections);
  console.log(getOption("feature")[0], FEATURES[getOption("feature")]);

  // We could make this better, for example:
  // - list which teams a feature depends on using teams.json
  // - aggregate stats for dependencies for a given release
  // - visualize the tree

  // But right now just dump a list of dependencies into a <pre>
  let featureComponents = FEATURES[getOption("feature")[0]];
  if (!featureComponents) {
    throw new Error("Unknown feature");
  }

  let dependencies = new Map();
  function addComponentAndDependencies(componentName, depth = 1) {
    if (dependencies.has(componentName)) {
      return;
    }
    if (depth > 50) {
      return;
    }
    dependencies.set(componentName, depth);
    let connection = connections.filter((c) => c.component == componentName)[0];

    console.log(componentName, depth)
    if (!connection) {
      console.error(`No connection for ${componentName}`);
      return;
    }

    let mostCommonRegressionsFrom =
      connection.most_common_regression_components;
    for (let regresssionComponentName in mostCommonRegressionsFrom) {
      if (mostCommonRegressionsFrom[regresssionComponentName] < 0.01) {
        continue;
      }
      // Go fetch subdependencies
      addComponentAndDependencies(regresssionComponentName, depth++);
    }
  }
  for (let featureComponent of featureComponents) {
    addComponentAndDependencies(featureComponent);
  }

  console.log(dependencies);
  document.querySelector("#feature-dependencies").textContent = JSON.stringify(
    [...dependencies.entries()],
    null,
    2
  );
}

(function init() {
  rerender();
})();
