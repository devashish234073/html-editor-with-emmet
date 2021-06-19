# html-editor-with-emmet

run "npm test" , "node index.js help" or "node index.js TEST 'table>tr*3>td*3>lorem1'" to get started.

## To import as module and use:

var htmlEditorWithEmmet = require("html-editor-with-emmet");
htmlEditorWithEmmet.run();

### Or to run at port 9090 use :

var htmlEditorWithEmmet = require("html-editor-with-emmet");
htmlEditorWithEmmet.run(9090);

## When running as standalone application

You can start the server by running 'node index.js RUN' or by running 'node index.js RUN 9090' to run at port 9090

Then from a browser you can access the service as:

1. http://localhost:9090/test?type=html&exp=table>tr*3>td*3>lorem1
2. http://localhost:9090/test?type=xml&exp=table>tr*3>td*3>lorem1
3. http://localhost:9090/test?type=json&exp=table>tr*3>td*3>lorem1
4. http://localhost:9090/test?exp=table>tr*3>td*3>lorem1

Video demonstration of the application: https://www.youtube.com/watch?v=dPmCMvu639E

![image](https://user-images.githubusercontent.com/20777854/122639696-e0733900-d118-11eb-8b9d-dbe44fe86f56.png)
