import csv

def getNotes(path,Students):
   cols=[]
   with open (f'{path}',newline='\n') as f:
      freader =csv.reader(f)
      for row in freader:
         cols.append(row)
      
      for j in range(len(cols)):
         i=0
         b=False
         while i<len(Students) and not(b):
            name =(cols[j][0]+' '+cols[j][1]).lower()
            name1 = (Students[i][2]).lower()
            if ( name == name1):
               if str(cols[j][2]).lower() == 'abs':
                   cols[j][2]=0
               Students[i].append(float(str(cols[j][2])))
               b = True
            else :
               i +=1
First_names =[]
Last_names =[]
Sections =[]
groups =[]
cols =[]
colls=[]
Students =[]
#geting the file
with open("ClassementPy\\Data\\1cpiSections.csv", newline="\n") as f:
   spamreader = csv.reader(f)
   #getting every colomun
   for row in spamreader:
      cols.append(row)

#getting the name section and the grou

for col in cols:
   groups.append(col[2])
   Sections.append(col[3].strip())
   First_names.append(col[0])
   Last_names.append(col[1])
#formatting every student
for i in range(len(Sections)):
   Student=[]
   Student.append(Sections[i])
   if(len(groups[i]) == 1):
      Student.append('0'+groups[i])
   else:
      Student.append(groups[i])
   Student.append(First_names[i] + ' '+Last_names[i])
   Students.append(Student)
First_names.clear()
Last_names.clear()
Sections.clear()
groups.clear()
cols.clear()
colls.clear()
algo="ClassementPy\\Data\\Notes Algo.csv"
getNotes(algo,Students)
Analyse="ClassementPy\\Data\\Notes Analyse.csv"
getNotes(Analyse,Students)
Archi ="ClassementPy\\Data\\Notes Archi.csv"
getNotes(Archi,Students)
elec="ClassementPy\\Data\\Notes Elec.csv"
getNotes(elec,Students)
algebre ="ClassementPy\\Data\\Notes Algèbre1.csv"
getNotes(algebre,Students)
tee ="ClassementPy\\Data\\Notes T.E.E.csv"
getNotes(tee,Students)
bw = "ClassementPy\\Data\\Notes-BW.csv"
getNotes(bw,Students)
sys1="ClassementPy\\Data\\Notes Système 1.csv"
getNotes(sys1,Students)

# clearing it
for stud in Students:
   if len(stud) < 11:
      Students.remove(stud)

#calculating the avrg
def avgS (student):
   s = float(student[3])*5 + float(student[4])*5 + float(student[5]) * 4 + float(student[6]) * 3 + float(student[7]) * 3 +float(student[8])*2 + float(student[9])*1 + float(student[10])*3;
   return float("{:.2f}".format(s/26))
for stud in Students:
   if len(stud) < 11:
      Students.remove(stud)
for student in Students:
    student.insert(3,avgS(student))
#ranking them
for i in range(len(Students)-2):
   for j in range(len(Students)-1-i):
      if float(Students[j][3]) < float(Students[j+1][3]):
         x = Students[j]
         Students[j] = Students[j+1]
         Students[j+1] = x
for student in Students:
    student.insert(2,Students.index(student)+1)

with open("ClassementPy\\Final_results.csv",'w', newline="\n") as f:
   spamwriter = csv.writer(f)
   spamwriter.writerow(['Sections','Groups','Rank','Full Name','Average','Algo','Analyse','Archi','Elec','Algebra','TEE','BW','Sys1'])
   for stud in Students:
      if len(stud)>=12:
         spamwriter.writerow([*stud])

  