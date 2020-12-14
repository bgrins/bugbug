
from bugbug import db, repository, bugzilla, utils
import csv

r = utils.get_session("bugzilla").get(
    "https://bugzilla.mozilla.org/rest/product?type=enterable&include_fields=name&include_fields=components.name&include_fields=components.triage_owner&names=Core&names=Toolkit&names=Firefox"
)
r.raise_for_status()
products = r.json()["products"]

team_mapping = bugzilla.get_component_team_mapping()

print(bugzilla.component_to_team(team_mapping, "Core", "JavaScript Engine"))

with open("components.csv", "w") as f:
  writer = csv.writer(f)
  writer.writerow(["Product", "Component", "Team", "Triage owner"])
  for product in products:
    print(product)
    for component in product.get("components"):
      team = bugzilla.component_to_team(team_mapping, product.get("name"), component.get("name"))
      writer.writerow([product.get("name"), component.get("name"), team, component.get("triage_owner")])

