import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import re

# First I loaded ~6,000 movies to my screen on https://www.themoviedb.org/ and then copy pasted the html content into a file.
# This way because for some reason I couldn't directly fetch it and it might have been harder to lazy load more content.

## Part 1 ##
# scrape html

# with open('raw.html', 'r') as f:
#   contents = f.read()
#   soup = BeautifulSoup(contents)

#   movie_ids = list(map(lambda x: x["href"].split("/")[2], soup.find_all("a", class_="image")))
#   print("soup:",movie_ids[:5])

#   os.remove("movie_ids.json")
#   with open('movie_ids.json', 'w') as outfile:
#     json.dump(movie_ids, outfile)


## Part 2 ##
# Get data from endpoints
# with open('movie_ids.json', 'r') as f:
#   data = json.load(f)
#   print(len(data))
#   lendata = len(data)
#   output = {}
#   start = datetime.now()
#   for index, movie_id in enumerate(data):
#     try:
#       basic = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=3cf67c91ea3024df54969204163fe383").json()
#       creds = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=3cf67c91ea3024df54969204163fe383").json()
#       output[basic["original_title"]] = { "movie_id": movie_id, **basic, **creds }
#       print(f"{index}/{lendata}")
#     except:
#       print("-" * 10)
#       print("error movie_id:", movie_id)
#   print("time:",datetime.now() - start)
# if os.path.exists("movie_data.json"):
#   os.remove("movie_data.json")
# with open("movie_data.json", "w") as outfile:
#   json.dump(output, outfile)

## Part 3 ##
# Clean data to have only necessary
# with open("movie_data.json", 'r') as f:
#   cleaned_data = {}
#   data = json.load(f)
#   keys = list(data.keys())
#   for index, movie_name in enumerate(keys):
#     try:
#       movie_data = data[movie_name]
      
#       # clean data
#       director = list(map(lambda x: x["name"], list(filter(lambda x: x["job"] == "Director", movie_data["crew"]))))
      
#       actors = list(filter(lambda x: x["known_for_department"] == "Acting", movie_data["cast"]))
#       cast = list(map(lambda x: x["name"], actors))
      
#       genre = list(map(lambda x: x["name"], movie_data["genres"]))

#       year = int(movie_data["release_date"].split("-")[0])
      
#       imdb = movie_data["vote_average"]

#       rating = None
      
#       cleaned_data[movie_name] = {
#         "director": director,
#         "cast": cast,
#         "genre": genre,
#         "year": year,
#         "imdb": imdb,
#         "rating": rating
#       }
#       if index % 1000 == 0:
#         print(index)
#     except:
#       print("error:",movie_name)

# if os.path.exists("clean_movie_data.json"):
#   os.remove("clean_movie_data.json")
# with open("clean_movie_data.json", "w") as outfile:
#   json.dump(cleaned_data, outfile)

## Step 4 ##
# Scrape missing data from imdb
# with open("movie_data.json", 'r') as f:
#   with open("clean_movie_data.json", 'r') as fc:
#     data = json.load(f)
#     clean_data = json.load(fc)
#     error_data = []
#     keys = list(data.keys())

#     for index, movie_name in enumerate(keys):
#       try:
#         imdb_id = data[movie_name]["imdb_id"]
#         imdb_url = f"https://www.imdb.com/title/{imdb_id}/"
#         res = requests.get(imdb_url)
#         soup = BeautifulSoup(res.text, "html.parser")
#         imbd_rating = soup.select('span[class*="AggregateRatingButton__RatingScore-"]')[0].text

#         rating = soup.select('span[class*="TitleBlockMetaData__ListItemText-"]')[1].text

#         if movie_name in clean_data:
#           clean_data[movie_name]["imdb"] = imbd_rating
#           clean_data[movie_name]["rating"] = rating
        
#         if index % 100 == 0:
#           print(index)
#           if os.path.exists("clean_movie_data_enhanced_with_imdb.json"):
#             os.remove("clean_movie_data_enhanced_with_imdb.json")
#           with open("clean_movie_data_enhanced_with_imdb.json", "w") as outfile:
#             json.dump(clean_data, outfile)

#           if os.path.exists("error_logs.json"):
#             os.remove("error_logs.json")
#           with open("error_logs.json", "w") as outfile:
#             json.dump(error_data, outfile)
#       except:
#         print("error:",movie_name)
#         imdb_id = None
#         try:
#           imdb_id = data[movie_name]["imdb_id"]
#         except:
#           pass
#         error_data.append([movie_name, imdb_id])

# if os.path.exists("clean_movie_data_enhanced_with_imdb.json"):
#   os.remove("clean_movie_data_enhanced_with_imdb.json")
# with open("clean_movie_data_enhanced_with_imdb.json", "w") as outfile:
#   json.dump(clean_data, outfile)

# if os.path.exists("error_logs.json"):
#   os.remove("error_logs.json")
# with open("error_logs.json", "w") as outfile:
#   json.dump(error_data, outfile)


## Part 5 ##
# Remove all incomplete data
# with open("data/clean_movie_data_enhanced_with_imdb.json", 'r') as f:
#   data = json.load(f)
#   clean_data = {}

#   for index, (movie_name, movie_data) in enumerate(list(data.items())):
#     has_incorrect_data = len(movie_data["director"]) == 0 or len(movie_data["cast"]) == 0 or len(movie_data["genre"]) == 0 or not movie_data["imdb"] or not movie_data["rating"] or not movie_data["year"] or not movie_data["imdb"] or not movie_data["rating"]
#     if not has_incorrect_data:
#       clean_data[movie_name] = movie_data

# if os.path.exists("data/final.json"):
#   os.remove("data/final.json")
# with open("data/final.json", "w") as outfile:
#   json.dump(clean_data, outfile)

## Part 6 ##
# Generate movie name list
# with open("data/final.json", 'r') as f:
#   data = json.load(f)
#   movie_names = list(data.keys())

# if os.path.exists("data/final_movie_names.json"):
#   os.remove("data/final_movie_names.json")
# with open("data/final_movie_names.json", "w") as outfile:
#   json.dump(movie_names, outfile)