# topicos-proyecto-final

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.5. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.


## arrancar puerto 
```bash
 bun run src/index.ts
 ```
 
   ## endpoints  (curl) 
  
  ejemplo de uso de endpoints
   
## rotar 
  
```bash
curl -X POST http://localhost:3000/images/rotate \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/home/victor/Descargas/Gagamaru_U20_Uniform_1.webp" \
  -F "angle=111"\
  --output rotated.webp
```
##  redimencionar  

```bash
 curl -X POST http://localhost:3000/images/resize \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/home/victor/Descargas/Gagamaru_U20_Uniform_1.webp"\
  -F "width=30" \
  -F "height=20" \
  --output resized.png
```

## recortar 
```bash
curl -X POST http://localhost:3000/images/crop \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/home/victor/Descargas/Gagamaru_U20_Uniform_1.webp" \
  -F "left=10" -F "top=10" -F "width=50" -F "height=50" \
  --output cropped_final.png
```

## filtro 

```bash
curl -X POST http://localhost:3000/images/filter \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/home/victor/Descargas/Gagamaru_U20_Uniform_1.webp" \
  -F "filter=grayscale" \
  --output filtered.png
```

## convertir formato 
```bash
curl -X POST http://localhost:3000/images/format \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/home/victor/Descargas/Gagamaru_U20_Uniform_1.webp" \
  -F "format=jpeg" \
  --output converted.jpeg
```

 ## pipeline 
```bash
curl -X POST http://localhost:3000/images/pipeline \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/home/victor/Descargas/Gagamaru_U20_Uniform_1.webp" \
  -F 'operations=[{"type":"resize","params":{"width":800}},{"type":"format","params":{"format":"webp"}}]' \
  --output pipeline_test.webp
```
