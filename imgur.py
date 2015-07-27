#!/usr/bin/env python

from imgurpython import ImgurClient
import os
import credentials

client = ImgurClient(credentials.IMGUR_CLIENT_ID, credentials.IMGUR_CLIENT_SECRET)
print client.credits

png_files = [file for file in os.listdir("./") if file.endswith(".png")]
png_files.sort()

print "Uploading %i PNGs" % len(png_files)

ids = []
for png_file in png_files:
	id = client.upload_from_path(png_file)['id']
	ids.append(id)
	print "%s %s" % (png_file, id)

client.create_album({ids:ids, title:"Title"})
