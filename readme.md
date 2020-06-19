Tool for processing CSV documents with lat and long fields to work out location addresses.

Looks for start and end times on each row and calculates the duration in minutes for that row.

Exports results to a csv with extra fields

TODO
- Turn into a local webapp - DONE
- Add limit option - DONE (dev only)
- Stop and start processing - DONE
- Output errors in the UI - DONE
- Display Alert when trying to navigate away
- Add option to enable/disable auto download
- Refactor app config (limit / auto download) into context
- Add Headers processing output to UI before processing rest of file
- Add gap calculation between rows
- Calculate duration at each location
- Work out when travelling
