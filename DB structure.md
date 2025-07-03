Data model:

Courses → composed of Modules

Modules → composed of Sections (composed of components)

Each Course and Section may link to a Quiz (with questions).

Images are stored separately in an images collection, each with a binary buffer.

Linking is mostly by storing ids (course_id, module_id, etc.) so you can look up related objects.

The flexible use of Object fields (e.g., module_ids, section_ids, contents, questions) lets you store arrays, maps, or even nested content — which makes your schema more adaptable.



Database structure:

Hierarchical: courses → modules → sections → quizzes

Linkage: each data has an id which will be how it will be accessed for example, if a course.module_ids = ["x","y","z"]... then we go to modules and filter them by id and then those are the modules of that course 

Images are separately saved as binary data

Flexible object fields inside collections let you store arrays or nested data

IDs help keep documents normalized, so you can join data in code

data models are saved in ./server/models