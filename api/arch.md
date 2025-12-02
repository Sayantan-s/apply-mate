## Requirement gathering

### Functional Requirements

<strong><u>client</u></strong>

- user can drop a resume(dropzone)
- user can click and upload resume
- user can paste public links from google drive / dropbox
- user can upload either pdf or doc or docx file
- user can add a jd text or link in the input box
- ability to choose from pre-uploaded resumes

<strong><u>api</u></strong>

- should be able to detect links or jd (detects if it's really a jd or not)
- should be able to detect navigation jd urls needs auth or they are non-auth pages.
- analyse if the candidate's fit for the job and generate a recommending report
- save resume as vectors for future use-cases

### Non Functional Requirements

- polling system / shimmer ui to update user about analysis status (UX).
- avoid duplicacy in resumes -> check for overall vector level matching
- api latency (distribute long running tasks)
