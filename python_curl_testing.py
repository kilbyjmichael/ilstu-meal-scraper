import requests

'''Hypothesis: If you haven't visited all of the links (as if clicking), the server won't let you visit a farther one than you have clicked.'''

# Get me some cookies
# session = requests.Session()
response = requests.post('http://dining.illinoisstate.edu/NetNutrition/123/')
# cookies = session.cookies.get_dict()

cookies = response.cookies

# Now that we have cookies, request stuff
data = requests.post('http://dining.illinoisstate.edu/NetNutrition/123/Unit/SelectUnitFromChildUnitsList', data = 'unitOid=6', cookies = cookies)

# print(data)
# print(data.content)

print(data.content.find(b'Juice'))

# Cookies now work.
