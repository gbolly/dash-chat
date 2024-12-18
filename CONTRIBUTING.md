# CONTRIBUTING

Thank you for your interest in contributing to the dash-chat codebase!

If you would like to add or update a feature in dash-chat, it is recommended that you first file a GitHub issue to discuss your proposed changes and check their compatibility with the rest of the package before making a pull request.

This page assumes that you have already created a fork of the [dash-chat repository](https://github.com/gbolly/dash-chat) under your GitHub account and have the codebase available locally for development work. If you have followed [these steps](#install-dependencies), then you are all set.

### Install dependencies

1. Install npm packages
    ```
    $ npm install
    ```
2. Create a virtual env and activate.
    ```
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```
    $ pip install -r requirements.txt
    ```
4. Install the python packages for testing (optional)
    ```
    $ pip install -r tests/requirements.txt
    ```

### Writing your component code.
To work on a feature or bug fix:
1. Before doing any work, check out the main branch and make sure that your local main branch is up-to-date with upstream main:
```
git checkout main
git pull upstream main
```
2. Create a new branch. This branch is where you will make commits of your work. (As a best practice, never make commits while on a main branch. Running git branch tells you which branch you are on.)
```
git checkout -b new-branch-name
```
3. Make as many commits as needed for your work.
4. When you feel your work is ready for a pull request, push your branch to your fork.
```
git push origin new-branch-name
```
5. Go to your fork https://github.com/<your-github-username>/dash-chat and create a pull request off of your branch against the https://github.com/gbolly/dash-chat repo.

NB:
- If necessary, create a new file for large and reusable components. Ensure to reflect props that are required in `src/lib/components/ChatComponent.js`. 
- The demo app is in `src/demo` and you will import your example component code into your demo app.
- Test your code in a Python environment:
    1. Build your code
        ```
        $ npm run build
        ```
    2. Run and modify the `usage.py` sample dash app:
        ```
        $ python usage.py
        ```
- Write tests for your component.
    - A sample test is available in `tests/test_usage.py`, it will load `usage.py` and you can then automate interactions with selenium.
    - Run the tests with `$ pytest tests`.
    - The Dash team uses these types of integration tests extensively. Browse the Dash component code on GitHub for more examples of testing (e.g. https://github.com/plotly/dash-core-components)
- Add custom styles to your component by putting your custom CSS files into your distribution folder (`dash_chat`).
    - Make sure that they are referenced in `MANIFEST.in` so that they get properly included when you're ready to publish your component.
    - Make sure the stylesheets are added to the `_css_dist` dict in `dash_chat/__init__.py` so dash will serve them automatically when the component suite is requested.
- [Review your code](./review_checklist.md)

### Create a production build and publish:

1. Build your code:
    ```
    $ npm run build
    ```
2. Create a Python distribution
    ```
    $ python setup.py sdist bdist_wheel
    ```
    This will create source and wheel distribution in the generated the `dist/` folder.
    See [PyPA](https://packaging.python.org/guides/distributing-packages-using-setuptools/#packaging-your-project)
    for more information.

3. Test your tarball by copying it into a new environment and installing it locally:
    ```
    $ pip install dash_chat-0.0.1.tar.gz
    ```

4. If it works, then you can publish the component to NPM and PyPI:
    1. Publish on PyPI
        ```
        $ twine upload dist/*
        ```
    2. Cleanup the dist folder (optional)
        ```
        $ rm -rf dist
        ```
    3. Publish on NPM (Optional if chosen False in `publish_on_npm`)
        ```
        $ npm publish
        ```
        _Publishing your component to NPM will make the JavaScript bundles available on the unpkg CDN. By default, Dash serves the component library's CSS and JS locally, but if you choose to publish the package to NPM you can set `serve_locally` to `False` and you may see faster load times._

5. Share your component with the community! https://community.plotly.com/c/dash
    1. Publish this repository to GitHub
    2. Tag your GitHub repository with the plotly-dash tag so that it appears here: https://github.com/topics/plotly-dash
    3. Create a post in the Dash community forum: https://community.plotly.com/c/dash