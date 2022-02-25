import enum
import json

def writePage(data,index):
    with open(f"./htmls/f{index}.html","w+") as f:
        f.write('<!DOCTYPE html>\n')
        f.write('<html lang="eng">\n')
        f.write('<head>\n')
        f.write('\t<meta charset="UTF-8">\n')
        f.write('\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        f.write('\t<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">\n')
        f.write(f'\t<title>{data["title"]}</title>\n')
        f.write('</head>\n<body>\n')
        f.write(f'\t<div class="w3-bar w3-center"><h1>{data["title"]}</h1></div>\n')
        f.write(f'\t<div class="w3-container w3-margin-left"><h3>Release Date: {data["year"]}</h3>\n')
        f.write('\t\t<h4>Cast:</h4>\n')
        f.write('\t\t<ul>\n')
        for actor in data["cast"]:
            f.write(f'\t\t\t<li>{actor}</li>\n')
        f.write('\t\t</ul>\n')
        f.write('\t\t<h3>Genres:</h3>\n')
        f.write('\t\t<ul>\n')
        for genre in data["genres"]:
            f.write(f'\t\t\t<li>{genre}</li>\n')
        f.write('\t\t</ul>\n')
        f.write('\t</div>\n')
        f.write('\t<div class="w3-container w3-center"><a href="http://localhost:7777/filmes">Go Back</a></div>\n')
        f.write('</body>\n')
        f.write('</html>\n')
        
def writePageActor(data,index):
    with open(f"./htmls/a{index}.html","w+") as f:
        f.write('<!DOCTYPE html>\n')
        f.write('<html lang="eng">\n')
        f.write('<head>\n')
        f.write('\t<meta charset="UTF-8">\n')
        f.write('\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        f.write('\t<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">\n')
        f.write(f'\t<title>{data[0]}</title>\n')
        f.write('</head>\n<body>\n')
        f.write(f'\t<div class="w3-bar w3-center"><h1>{data[0]}</h1></div>\n')
        f.write('\t\t<h4>Movies:</h4>\n')
        f.write('\t\t<ul>\n')
        for movie in data[1]:
            f.write(f'\t\t\t<li>{movie}</li>\n')
        f.write('\t\t</ul>\n')
        f.write('\t<div class="w3-container w3-center"><a href="http://localhost:7777/atores">Go Back</a></div>\n')
        f.write('</body>\n')
        f.write('</html>\n')
        

with open("./cinemaATP.json") as f:
    data = json.load(f)

for ele in enumerate(data):
    writePage(ele[1],ele[0]+1)
    data[ele[0]]["index"] = ele[0]+1

movies_sorted = list(sorted(data,key = lambda x: x["title"]))

with open("./htmls/index.html","w") as f:
        f.write('<!DOCTYPE html>\n')
        f.write('<html lang="eng">\n')
        f.write('<head>\n')
        f.write('\t<meta charset="UTF-8">\n')
        f.write('\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        f.write('\t<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">\n')
        f.write(f'\t<title>Filmes</title>\n')
        f.write('</head>\n<body>\n')
        f.write('\t<table class="w3-table w3-striped w3-border">\n')
        f.write('\t<tr>\n')
        f.write('\t\t<th>Movie Name</th>\n')
        f.write('\t\t<th>Release Date</th>\n')
        f.write('\t</tr>\n')
        for ele in movies_sorted:
            f.write('\t<tr>\n')
            f.write(f'\t\t<td><a href="http://localhost:7777/filmes/f{ele["index"]}">{ele["title"]}</a></td>\n')
            f.write(f'\t\t<td>{ele["year"]}</td>\n')
            f.write('\t</tr>\n')
        f.write('</body>\n')
        f.write('</html>\n')    

atores = {}
for ele in data:
    for ator in ele["cast"]:
        if ator not in atores:
            atores[ator] = [ele["title"]]
        else:
            atores[ator].append(ele["title"])

atores = list(sorted(atores.items(),key=lambda x:x[0]))
atores = list(filter(lambda x:x[0][0].isupper(),atores))

with open("./htmls/atores.html","w") as f:
        f.write('<!DOCTYPE html>\n')
        f.write('<html lang="eng">\n')
        f.write('<head>\n')
        f.write('\t<meta charset="UTF-8">\n')
        f.write('\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
        f.write('\t<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">\n')
        f.write(f'\t<title>Atores</title>\n')
        f.write('</head>\n<body>\n')
        f.write('\t<table class="w3-table w3-striped w3-border">\n')
        f.write('\t<tr>\n')
        f.write('\t\t<th>Actor</th>\n')
        f.write('\t\t<th>Number of Movies</th>\n')
        f.write('\t</tr>\n')
        for ele in enumerate(atores):
            f.write('\t<tr>\n')
            f.write(f'\t\t<td><a href="http://localhost:7777/atores/a{ele[0]+1}">{ele[1][0]}</a></td>\n')
            f.write(f'\t\t<td>{len(ele[1][1])}</td>\n')
            f.write('\t</tr>\n')
        f.write('</body>\n')
        f.write('</html>\n')    

for actor in enumerate(atores):
    writePageActor(actor[1],actor[0]+1)