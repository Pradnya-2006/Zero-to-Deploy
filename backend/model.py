import google.generativeai as genai

genai.configure(api_key="AIzaSyAN3PYGBhGpZyMV5kOxHBDQfhpvreO1tz4")

models = genai.list_models()
for m in models:
    print(m.name)