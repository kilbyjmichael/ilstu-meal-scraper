import requests

# Get me some cookies
# session = requests.Session()
response = requests.post('http://dining.illinoisstate.edu/NetNutrition/123/')
# cookies = session.cookies.get_dict()

# Now that we have cookies, request stuff
data = requests.post('http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromUnitsList', data = 'unitOid=1', cookies = response.cookies)

print(data)
print(data.content)

# Cookies now work.
