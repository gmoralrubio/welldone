# Flujo de trabajo con Pull Requests (sin push directo a main)

Guía paso a paso para trabajar en un proyecto protegiendo la rama `main`, usando ramas de trabajo, pull requests (PR) y revisiones de código.

## 0. Requisitos previos (una sola vez por proyecto)

1. **Protege la rama `main` en el remoto** (GitHub/GitLab/etc.):
   - Activa "Require a pull request before merging".
   - Activa "Require approvals" (al menos 1 revisor).
   - Opcional: "Require status checks to pass" (CI, linter, tests).
   - Esto hace que sea _imposible_ hacer push directo a `main`, aunque alguien lo intente por error.

## 1. Sincroniza main antes de empezar

Siempre parte de la última versión de `main`:

```bash
git checkout main
git pull origin main
```

## 2. Crea una rama nueva para tu tarea

Nunca trabajes directamente sobre `main`. Usa un nombre descriptivo, con un prefijo que indique el tipo de cambio:

```bash
git checkout -b feature/nombre-de-la-tarea
# otros prefijos comunes: fix/, chore/, docs/, refactor/
```

Ejemplo:

```bash
git checkout -b feature/login-con-google
```

## 3. Trabaja y haz commits pequeños y claros

```bash
git add .
git commit -m "feat: añade botón de login con Google"
```

Recomendaciones:

- Commits pequeños y atómicos (una cosa por commit).
- Mensajes claros; si usas [Conventional Commits](https://www.conventionalcommits.org/), mejor aún (`feat:`, `fix:`, `docs:`, `refactor:`...).
- Haz commit con frecuencia; puedes reordenar/limpiar el historial después con `rebase -i` si hace falta.

## 4. Mantén tu rama actualizada con main

Si `main` avanza mientras tú trabajas, actualiza tu rama para evitar conflictos grandes al final:

```bash
git checkout main
git pull origin main
git checkout feature/nombre-de-la-tarea
git rebase main
```

Si hay conflictos, Git te lo indicará; resuélvelos, luego:

```bash
git add <archivos-resueltos>
git rebase --continue
```

> Alternativa más sencilla si no te gusta el rebase: `git merge main` en vez de `git rebase main`. Es menos "limpio" en el historial pero evita sorpresas si no dominas el rebase.

## 5. Sube tu rama al remoto

```bash
git push origin feature/nombre-de-la-tarea
```

Si ya hiciste rebase y la rama ya existía en el remoto, necesitarás forzar el push (solo en tu propia rama, nunca en `main`):

```bash
git push --force-with-lease origin feature/nombre-de-la-tarea
```

## 6. Abre el Pull Request

Desde GitHub abre el Pull Request

Buenas prácticas para la descripción del PR:

- Qué problema resuelve.
- Cómo probarlo (pasos manuales, capturas si aplica).
- Referencia al issue relacionado (`Closes #123`).
- Cualquier cosa pendiente o fuera de alcance.

## 7. Revisión (code review)

1. Asigna al menos un revisor
2. El revisor comenta, sugiere cambios o aprueba (`Approve`).
3. Si hay comentarios, aplica los cambios en la misma rama:
   ```bash
   # edita el código
   git add .
   git commit -m "fix: aplica comentarios de la review"
   git push origin feature/nombre-de-la-tarea
   ```
   El PR se actualiza automáticamente con el nuevo commit.
4. Espera la aprobación.

## 8. Mergea el PR

Una vez aprobado y con los checks en verde, mergea desde la web.

Estrategias de merge habituales:

- **Squash and merge**: junta todos los commits de la rama en uno solo sobre `main`. Historial limpio, recomendado para la mayoría de proyectos.
- **Rebase and merge**: mantiene los commits individuales pero los coloca de forma lineal sobre `main`.
- **Merge commit**: conserva todo el historial de la rama con un commit de merge explícito.

## 9. Limpieza post-merge

```bash
git checkout main
git pull origin main
git branch -d feature/nombre-de-la-tarea
git push origin --delete feature/nombre-de-la-tarea
```

## Resumen visual del ciclo

```
main ──●───────────────●───────────────●──▶
        \               ▲               \
         \   (PR + review)               \
          ●───●───●───●─┘                 ●──▶ (siguiente tarea)
        feature/tarea-1
```

## Checklist rápido

- [ ] Rama `main` protegida en el remoto (no permite push directo).
- [ ] Crear rama nueva desde `main` actualizado.
- [ ] Commits pequeños y descriptivos.
- [ ] Rebase/merge con `main` antes de abrir el PR si ha pasado tiempo.
- [ ] Abrir PR con descripción clara.
- [ ] Pasar review y checks automáticos.
- [ ] Mergear (squash recomendado) y borrar la rama.

---

_Tip: si usas `lazygit` en terminal, puedes gestionar ramas, commits y rebases interactivos con `git rebase -i` de forma mucho más visual sin salir del flujo de teclado._
