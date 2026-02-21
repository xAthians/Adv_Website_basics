CREATE
```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: create Resource(data)
        S->>DB: INSERT INTO resources
        DB-->>S: Result / Duplicate error

        alt Duplicate
            S-->>B: Duplicate detected
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            S-->>B: Created resource
            B-->>F: 201 Created
            F-->>U: Show success message
        end
    end
```
READ
```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Page loads / Refresh
    F->>B: GET /api/resources
    B->>S: getAllResources()
    S->>DB: SELECT * FROM resources
    DB-->>S: Rows[]
    S-->>B: Resource list
    B-->>F: 200 OK (JSON)
    F-->>U: Render resource list
```


UPDATE
```mermaid
sequenceDiagram
    sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit edit form
    F->>B: PUT /api/resources/:id (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: updateResource(id, data)
        S->>DB: UPDATE resources SET ... WHERE id = :id
        DB-->>S: Updated row / Not found

        alt Not found
            S-->>B: Resource missing
            B-->>F: 404 Not Found
            F-->>U: Show "not found"
        else Success
            S-->>B: Updated resource
            B-->>F: 200 OK
            F-->>U: Show success message
        end
    end
```



DELETE
```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Click "Delete"
    F->>B: DELETE /api/resources/:id

    B->>S: deleteResource(id)
    S->>DB: DELETE FROM resources WHERE id = :id
    DB-->>S: Delete result (0 or 1 rows)

    alt Resource not found
        S-->>B: Nothing deleted
        B-->>F: 404 Not Found
        F-->>U: Show "not found"
    else Deleted
        S-->>B: Deleted
        B-->>F: 204 No Content
        F-->>U: Remove item from UI
    end
```