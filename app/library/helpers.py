import os.path
import uuid
from pathlib import Path
import markdown

def create_workspace():
    """
    Return workspace path
    """
    # base directory
    work_dir = Path('static/upload/')

    # 나중에 안정화 되면 지우는 기능 넣자!
    # os.remove(work_dir)

    # UUID to prevent file overwrite
    request_id = Path(str(uuid.uuid4())[:8])
    # path concat instead of work_dir + '/' + request_id
    workspace = work_dir / request_id
    if not os.path.exists(workspace):
        # recursively create workdir/unique_id
        os.makedirs(workspace)

    return workspace

def openfile(filename):
    filepath = os.path.join("app/pages/", filename)
    with open(filepath, "r", encoding="utf-8") as input_file:
        text = input_file.read()

    html = markdown.markdown(text)
    data = {
        "text": html
    }
    return data


