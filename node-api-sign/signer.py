from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key
import base64
import sys
import os

# pip3 install cryptography

data = (sys.argv[1]).encode()

try:
    # Attempt to decode the base64-encoded string
    data = base64.b64decode(data).decode('utf-8')
    data = data.encode()
    #print("Input is base64")
except Exception as e:
    # If decoding fails, return the original string
    #print("Input not base64")
    pass

# Load your private key
dir_path = os.path.dirname(os.path.realpath(__file__))
key_path = os.path.join(dir_path, 'private_key.pem')
with open(key_path, "rb") as key_file:
    private_key = load_pem_private_key(key_file.read(), password=None)

# Sign the data
signature = private_key.sign(
    data,
    padding.PKCS1v15(),
    hashes.SHA256()
)

# Encode the signature in base64 to simplify handling
signature_base64 = base64.b64encode(signature).decode()

print(signature_base64)
