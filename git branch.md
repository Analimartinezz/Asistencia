---
categoría: herramientas
tipo: bash
tags:
  - git
---
```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
```
## Ramas

```sh
git branch -m master main # cambia nombre de rama actaul a main
git branch #en que /rama te encuentras
git branch --list #muestra las ramas
git branch --all #muestra todas las ramas incluso las ocultas(las de los remotos)

git switch -c nueva rama #crea nueva rama y cambia a ella
git switch -  #alterna entre las dos ultimas ramas
git switch rama #cambia a una rama

```

## fusionar ramas

Como fusionar tu rama con la rama main

```sh
# merge fusiona tu rama con la rama master/main
# recomendacion antes:
git checkout main # 'cambiar a la rama master/main
git fetch #'actualiza tu rama del remoto si es el caso
# ahora si estando en la rama master/main
git merge rama-a-fusuionar
# ¡listo!
# Eliminar rama
git branch -d rama # elimina una rama
# antes de cambiar de rama debes guardar los cambios de la rama actual
# basicamente hacer git add . y git commit -m "mensaje"
```


## Ejemplo de fusión de ramas

```sh
# 0. creas una nueva carpeta
mkdir nueva
cd nueva
git init
#
# ahora estas en rama main
# creas un nuevo archivo
# 1. Iniciando main
echo "cambio 1" > archivo1.txt
git add .
git commit -m "iniciando rama main agregando archivo1.txt"

# 2. Crear una nueva rama y cambiarte a ella
git checkout -b newfeature
# o
git switch -c newfeature

# 3. Trabajar en la nueva rama: 
# editar archivos, luego confirmar los cambios
echo "cambio a" > archivoa.txt
git add .
git commit -m "Agregar archivoa.txt a rama newfeature"

# 4. Hacer más commits según sea necesario...
echo "cambio b" > archivob.txt
git add .
git commit -m "Fin en rama feature agregando archivob.txt"

# 5. Volver a la rama principal (main)
git checkout main

# 6. Fusionar la rama de la newfeature en main
git merge newfeature

# 7. eliminar la rama newfeature
git branch -d newfeature

```
## Trabajo cotidiano con una rama

```sh
# 1. Moverse a la rama
git checkout rama

# 2. Hacer cambios
# ...editar archivos...
# una vez lista una característica o un isues

# 3. Commitear cambios
git add . 
git commit -m "mensaje"

git pull origin rama
# 4. Subir cambios al remoto
git push origin rama
```
## Para ver el estado del archivo que se modifico si el git en la 3 de arriba no sube  o reconoce el archivo usar git status 
```sh
# 1.  ver el archivo modificado
git status 
# 2.  commitiar cambios
git add . 
git commit -m "mensaje"
git pull origin rama
# 4. Subir cambios al remoto 
git push origin rama
```