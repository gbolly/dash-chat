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
5. Go to your fork https://github.com/`<your-github-username>`/dash-chat and create a pull request off of your branch against the https://github.com/gbolly/dash-chat repo.

NB:
- If necessary, create a new file for large and reusable components in the `src` directory. Ensure to reflect props that are required in `src/lib/components/ChatComponent.js` and updating the `ChatComponent.propTypes` and `ChatComponent.defaultProps`. 

- Test your code in a Python environment:
    1. Build your code
        ```
        $ npm run build:py
        ```
    2. Modify and run the `usage.py` sample dash app:
        ```
        $ python usage.py
        ```
- Write tests for your component.
    - Update test cases for to reflect the new changes for both the React component in `tests/js-unit` and integration test for Python in `tests/test_chat_component.py`, it will load `usage.py` and you can then automate interactions with selenium.
    - Run the tests with `$ pytest tests` and `$ npm tests`.
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

4. If it works, then you can publish the component to PyPI:
    1. Publish on PyPI
        ```
        $ twine upload dist/*
        ```
    2. Cleanup the dist folder (optional)
        ```
        $ rm -rf dist
        ```
