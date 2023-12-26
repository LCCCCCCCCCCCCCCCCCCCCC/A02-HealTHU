import requests

host = "http://127.0.0.1:8000"

def printResJSON(resJSON, indent=0):
    # print the response.json() in a decent way
    # first, check which type it is
    if type(resJSON) == dict:
        # it is a dict
        print("{")
        for key, value in resJSON.items():
            print("\t" * (indent + 1) + str(key) + ": ", end="")
            # recursively print every value in the dict
            printResJSON(value, indent + 1)
        print("\t" * indent + "}")
    elif type(resJSON) == list:
        # it is a list
        print("[")
        for item in resJSON:
            # recursively print every item in the list
            print("\t" * (indent + 1), end="")
            printResJSON(item, indent + 1)
        print("\t" * indent + "]")
    else:
        # it is a primitive type
        print(resJSON)

def sendRequests():
    global host
    url = host
    print("enter to use auto mode, press any other key to test manually")
    mode = input()
    if mode != "":
        # ger HTTP method type
        print("enter HTTP method type:")
        httpMethod = input()
        # get app name
        print("enter app name:")
        appName = input()
        # get method name
        print("enter method name:")
        methodName = input()
        # get params
        # repeatedly get name and value of params
        # if name is 0, stop
        params = {}
        while True:
            print("enter param name:")
            paramName = input()
            if paramName == "0":
                break
            print("enter param value:")
            paramValue = input()
            params[paramName] = paramValue
    else:
        # mode == "auto"
        # open script.txt
        fileName = input("enter script file name: ")
        if fileName == "":
            fileName = "script.txt"
        f = open(fileName, "r")
        # the first line being host
        host = f.readline().strip()
        # the second line being HTTP method type
        httpMethod = f.readline().strip()
        # the third line being app name
        appName = f.readline().strip()
        # the fourth line being method name
        methodName = f.readline().strip()
        # for every two lines, the first line being param name, the second line being param value
        params = {}
        while True:
            paramName = f.readline().strip()
            if paramName == "0" or paramName == "":
                break
            paramValue = f.readline().strip()
            params[paramName] = paramValue
    # construct url
    url += "/" + appName + "/" + methodName + "/"
    print("\nrequest url: " + url)
    print("\nrequest params: {")
    for key in params:
        print("\t" + key + ": " + params[key])
    print("}\n")
    # construct request
    if httpMethod == "GET":
        response = requests.get(url, params=params)
    elif httpMethod == "POST":
        response = requests.post(url, data=params)
    else:
        print("invalid HTTP method type")
        return
    # get response
    print("response: ")
    # print the response.json() in a decent way
    # first check whether it is okay to use response.json()
    try:
        responseJSON = response.json()
        printResJSON(responseJSON)
    except:
        print(response.text)
    print("\n")
        
if __name__ == "__main__":
    while True:
        sendRequests()