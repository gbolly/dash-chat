import json
from setuptools import setup
from pathlib import Path

here = Path(__file__).parent
with open("package.json") as f:
    package = json.load(f)
long_description = (here / "README.md").read_text()

package_name = package["name"].replace(" ", "_")

setup(
    name=package_name,
    version=package["version"],
    author=package["author"],
    packages=[package_name.replace("-", "_")],
    include_package_data=True,
    license=package["license"],
    description=package.get("description", package_name),
    long_description=long_description,
    long_description_content_type="text/markdown",
    install_requires=[],
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Programming Language :: Python :: 3.13",
        "Framework :: Dash",
    ],
    project_urls={
        "Source Code": "https://github.com/gbolly/dash-chat",
    },
)
