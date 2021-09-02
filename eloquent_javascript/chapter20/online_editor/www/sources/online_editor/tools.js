import { getparentdir } from "./util.js";

const deleteFile = {
  tool: (state, baseurl, dispatch) => {
    if (state.currentfile) {
      const confirmDelete = window.confirm(
        `Do you want to delete: ${state.currentfile} ` +
          `(${state.currentdir})?`
      );
      if (confirmDelete)
        fetch(baseurl + state.currentfile, {
          method: "DELETE",
        }).then(() => {
          dispatch({ currentfile: "" }, { clearfile: true, refreshdir: true });
        });
    }
  },
  name: "delete file (ctrl + d)",
  hotkey: { ctrlKey: true, metaKey: true, key: "d" },
};
const saveFile = {
  tool: (state, baseurl, dispatch) => {
    if (!state.currentfile) return;
    const fileurl = baseurl + state.currentfile;
    fetch(fileurl, { method: "PUT", body: state.value }).then((resp) => {
      if (resp.ok) {
        dispatch({}, { refreshpreview: true });
      }
      console.log("saved");
    });
  },
  name: "save file (ctrl + s)",
  hotkey: { ctrlKey: true, metaKey: true, key: "s" },
};

const newFile = {
  tool: (state, baseurl, dispatch) => {
    const filename = prompt("Enter file name?");
    if (filename === null) return;
    const fileurl = baseurl + state.currentdir + filename;
    fetch(fileurl, { method: "PUT" }).then((resp) => {
      if (resp.ok) {
        dispatch(
          { currentfile: state.currentdir + filename },
          { openfile: true, refreshdir: true }
        );
        return;
      }
      console.log(resp);
    });
  },
  name: "new file (ctrl + b)",
  hotkey: { metaKey: true, ctrlKey: true, key: "b" },
};

const newDir = {
  tool: (state, baseurl, dispatch) => {
    const dirname = prompt("Enter directory name?");
    if (dirname === null) return;
    const dirurl = baseurl + state.currentdir + dirname;
    fetch(dirurl, { method: "MKCOL" }).then((resp) => {
      if (resp.ok) {
        dispatch({}, { refreshdir: true });
      }
    });
  },
  name: "new directory (ctrl + shift + b)",
  hotkey: { metaKey: true, ctrlKey: true, shiftKey: true, key: "b" },
};

const deleteDir = {
  tool: (state, baseurl, dispatch) => {
    if (state.currentdir == "/") {
      alert("You can't delete the root directory.");
      return;
    }
    const confirmDelete = confirm(
      "Are you sure you want to delete this directory? \n(all the files under this directory will be removed.)"
    );
    if (confirmDelete) {
      const parentdir = getparentdir(state.currentdir);
      fetch(baseurl + state.currentdir, { method: "DELETE" }).then((resp) => {
        if (resp.ok) {
          if (state.currentfile.startsWith(state.currentdir))
            dispatch(
              { currentdir: parentdir, currentfile: "" },
              { opendir: true }
            );
          else dispatch({ currentdir: parentdir }, { opendir: true });
          return;
        }
        console.log(resp);
      });
    }
  },
  name: "delete directory (ctrl + shift + d)",
  hotkey: { metaKey: true, ctrlKey: true, shiftKey: true, key: "d" },
};

export { deleteFile, saveFile, newFile, newDir, deleteDir };
