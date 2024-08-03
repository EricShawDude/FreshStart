from clarifai.client.model import Model

# Your PAT (Personal Access Token) can be found in the Account's Security section
# Specify the correct user_id/app_id pairings
# Since you're making inferences outside your app's scope
#USER_ID = "clarifai"
#APP_ID = "main"

# You can set the model using model URL or model ID.
# Change these to whatever model you want to use
# eg : MODEL_ID = "general-english-image-caption-blip"
# You can also set a particular model version by specifying the  version ID
# eg: MODEL_VERSION_ID = "cdb690f13e62470ea6723642044f95e4"
#  Model class objects can be inititalised by providing its URL or also by defining respective user_id, app_id and model_id

# eg : model = Model(user_id="clarifai", app_id="main", model_id=MODEL_ID)

model_url = (
    "https://clarifai.com/clarifai/main/models/food-item-recognition"
)
image_url = "https://media.discordapp.net/attachments/1100491665854185556/1269300833565282324/IMG_3746.jpg?ex=66af9005&is=66ae3e85&hm=24ac1f2e475654c9664b1f299e07bf20173ea6ef314a1d4c33ac4db3307e25d4&=&format=webp&width=496&height=662"

# The Predict API also accepts data through URL, Filepath & Bytes.
# Example for predict by filepath:
# model_prediction = Model(model_url).predict_by_filepath(filepath, input_type="text")

# Example for predict by bytes:
# model_prediction = Model(model_url).predict_by_bytes(image_bytes, input_type="text")

model_prediction = Model(url=model_url, pat="095a52b8d68a49a9bc38a58fd282075a").predict_by_url(
    image_url, input_type="image"
)

# Get the output
print(model_prediction.outputs[0].data.concepts)
