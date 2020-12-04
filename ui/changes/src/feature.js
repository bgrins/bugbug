import ApexCharts from "apexcharts";

// JSON from https://bugzilla.mozilla.org/show_bug.cgi?id=1669363
import teamComponentMapping from "./teams.json";
import { componentConnections } from "./common";

function rerender(connections, teamComponentMapping) {
  let teamContainer = document.createElement("div");
  for (let team in teamComponentMapping) {
    let details = document.createElement("details");
    let summary = document.createElement("summary");
    summary.textContent = team;
    details.appendChild(summary);
    teamContainer.append(details);
  }
  document.querySelector("#team-view").appendChild(teamContainer);

  document.querySelector("#component-source").textContent = JSON.stringify(
    connections,
    null,
    2
  );
}

(async function() {
  let connections = await componentConnections;
  console.log(connections);
  console.log(teamComponentMapping);

  // Return an object with each component and the components that are most likely
  // to cause regressions to that component.
  let connectionsMap = {};
  for (let c of connections) {
    for (let regression_component in c.most_common_regression_components) {
      // Ignore < N%
      if (c.most_common_regression_components[regression_component] < .05) {
        continue;
      }
      if (!connectionsMap[regression_component]) {
        connectionsMap[regression_component] = {};
      }
      connectionsMap[regression_component][c.component] =
        c.most_common_regression_components[regression_component];
    }
  }

  rerender(connectionsMap, teamComponentMapping);
})();
