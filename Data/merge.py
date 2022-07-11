import csv 

file_name ='Algo2Emd'

def openFile (fil,emdNum):
    emd = []
    with open (fil+emdNum+'.csv','r') as f:
        reader = csv.reader(f)
        for row in reader:
            emd.append(row)
    return emd


emd1 = openFile(file_name,'1')
emd2 = openFile(file_name,'2')
headers = emd2[0].copy()
emd2 = emd2[1:]
for student in emd2:
    #skipping the headers 
    i = 1
    found = False
    while i<len(emd1) and not(found):
        if (emd1[i][1]+emd1[i][2].lower().strip() == student[1]+student[2].lower().strip()):
            student[3] = emd1[i][3]
            found = True
        elif i == len(emd1) -1 :
            print(student)
            i += 1
        else:
            i += 1
emd1.clear()
new_file = file_name.replace('Emd','')
with open(new_file+'.csv','w') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(emd2)
    