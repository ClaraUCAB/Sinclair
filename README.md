# Sinclair
Rest API de manipulación de imágenes (Image Manipulation as a Service) con autenticación de usuarios a través de JWTs.
Esta API es para el proyecto final de la materia de Tópicos Especiales de Programación.

## Requerimientos
* Bun: [Guía de instalación](https://bun.com/docs/installation)

## Setup
1. Clona el repositorio
```bash
git clone https://github.com/ClaraUCAB/Sinclair
cd Sinclair
```
2. Instala las dependencias
```bash
bun install
```

## Ejecución
Para ejecutar la API con normalidad, corre:
```bash
bun run start
```
<details>
    <summary>Para development</summary>

 Al ejecutar el script de development, la API se reiniciará automáticamente cuando algún archivo cambie para poder probar los cambios inmediatamente en tiempo real.
    ```bash
bun run dev
    ```
</details>


## Uso
### Autenticación
Al realizar operaciones es necesario una JWT agregada como header `Authorization: Bearer <token>` en todas las peticiones.
Para esto primero es necesario autenticarse. Esto se logra con los siguientes endpoints:

| Método | URL                | Description                                     |
| ------ | ------------------ | ----------------------------------------------- |
| `POST` | `/auth/register`   | Registra al usuario en la DB.                   |
| `POST` | `/auth/login`      | Autentica al usuario. Devuelve una JWT.         |

### Transformación de imágenes
| Método | URL                | Description                                     |
| ------ | ------------------ | ----------------------------------------------- |
| `POST` | `/images/rotate`   | Rota la imagen.                                 |
| `POST` | `/images/resize`   | Redimensiona la imagen.                         |
| `POST` | `/images/crop  `   | Recorta la imagen.                              |
| `POST` | `/images/filter`   | Aplica un filtro a la imagen.                   |
| `POST` | `/images/format`   | Cambia el formato de la imagen.                 |
| `POST` | `/images/pipeline` | Encadena múltiples operaciones simultáneamente. |


## Parámetros
<details>
    <summary>Parámetros para los endpoints de <code>/auth/register</code> y <code>/auth/login</code></summary>

```ts
{
    email: string,
    password: string,
}
```
</details>

<details>
    <summary>Parámetros para los endpoints de <code>/images/rotate</code></summary>

```ts
{
    angle: number,
}
```
</details>

<details>
    <summary>Parámetros para los endpoints de <code>/images/resize</code></summary>

```ts
{
    width: number,
    height: number,
    fit?: ('cover' | 'contain' | 'fill' | 'inside' | 'outside'),
}
```
</details>

<details>
    <summary>Parámetros para los endpoints de <code>/images/crop</code></summary>

```ts
{
    left: number,
    top: number,
    width: number,
    height: number,
}
```
</details>

<details>
    <summary>Parámetros para los endpoints de <code>/images/filter</code></summary>

```ts
{
    filter: ('blur' | 'sharpen' | 'grayscale'),
}
```
</details>

<details>
    <summary>Parámetros para los endpoints de <code>/images/format</code></summary>

```ts
{
    format: ('jpeg' | 'png' | 'webp' | 'avif' | 'tiff'),
}
```
</details>


## Códigos de Estado HTTP
| Código | Situación                        |
| ------ | -------------------------------- |
| 200    | Operación exitosa                |
| 400    | Parámetros inválidos o faltantes |
| 401    | Token JWT ausente o inválido     |
| 413    | Archivo demasiado grande         |
| 415    | Formato de imagen no soportado   |
| 500    | Error interno del servidor       |


## Ejemplos
### Registrar usuario
```bash
curl -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email": "clarilu@email.com", "password": "waos123"}'
```

### Iniciar sesión
```bash
curl -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "clarilu@email.com", "password": "waos123"}'
```

### Rotar
```bash
curl -X POST http://localhost:3000/images/rotate \
    -H "Authorization: Bearer SnVlZ2EgVGVhbSBGb3J0cmVzcyAyCg==" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@images/narga.png" \
    -F "angle=111"\
    --output rotated.webp
```

###  Redimensionar
```bash
curl -X POST http://localhost:3000/images/resize \
    -H "Authorization: Bearer SnVlZ2EgVGVhbSBGb3J0cmVzcyAyCg==" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@images/narga.png"\
    -F "width=30" \
    -F "height=20" \
    --output resized.png
```

### Recortar
```bash
curl -X POST http://localhost:3000/images/crop \
    -H "Authorization: Bearer SnVlZ2EgVGVhbSBGb3J0cmVzcyAyCg==" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@images/narga.png" \
    -F "left=10" -F "top=10" -F "width=50" -F "height=50" \
    --output cropped_final.png
```

### Aplicar filtro
```bash
curl -X POST http://localhost:3000/images/filter \
    -H "Authorization: Bearer SnVlZ2EgVGVhbSBGb3J0cmVzcyAyCg==" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@images/narga.png" \
    -F "filter=grayscale" \
    --output filtered.png
```

### Convertir formato
```bash
curl -X POST http://localhost:3000/images/format \
    -H "Authorization: Bearer SnVlZ2EgVGVhbSBGb3J0cmVzcyAyCg==" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@images/narga.png" \
    -F "format=jpeg" \
    --output converted.jpeg
```

### Pipeline
```bash
curl -X POST http://localhost:3000/images/pipeline \
    -H "Authorization: Bearer SnVlZ2EgVGVhbSBGb3J0cmVzcyAyCg==" \
    -H "Content-Type: multipart/form-data" \
    -F "image=@images/narga.png" \
    -F 'operations=[{"type":"resize","params":{"width":800}},{"type":"format","params":{"format":"webp"}}]' \
    --output pipeline_test.webp
```

