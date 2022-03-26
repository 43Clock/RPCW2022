import json

with open("arq-son-EVO.json",encoding="utf-8-sig") as f:
    lines = f.readlines()

index = 1
musicas = []
for line in lines:
    dic = eval(line)
    for k,v in dic.items():
        if isinstance(v,str):
            dic[k] = v.replace("ï¿½","")
            dic[k] = dic[k].replace("Trs os Montes","Tras os Montes")
            dic[k] = dic[k].replace("Aores","Açores")
    dic["id"] = index
    index += 1
    musicas.append(dic)

with open("arq-son.json","w") as f:
    json.dump({"musicas":musicas},f,indent=4)
