
from bugbug import db, repository, bugzilla

# COMPONENT_COUNTS = {}
# for path in PATHS:
#   file_path = path.split(":")[0]
#   count = int(path.split(":")[1])
#   path_to_component = repository.get_component_mapping()
#   try:
#     component = path_to_component[file_path.encode("utf-8")].tobytes().decode("utf-8")
#     if component in COMPONENT_COUNTS:
#       COMPONENT_COUNTS[component] = COMPONENT_COUNTS[component] + count
#     else:
#       COMPONENT_COUNTS[component] = count
#   except KeyError:
#     print("error with " + file_path)
# print(dict(sorted(COMPONENT_COUNTS.items(), key=lambda item: -item[1])))
# print(bugzilla.get_component_team_mapping())
print(bugzilla.component_to_team(bugzilla.get_component_team_mapping(), "Core", "Security: PSM"))



# get_component_team_mapping
