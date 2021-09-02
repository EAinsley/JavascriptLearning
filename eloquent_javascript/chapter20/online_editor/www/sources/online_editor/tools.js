const deleteFile = {
  tool: function deleteFile(state, baseurl, dispatch) {
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
  name: "delete file",
  hotkey: { ctrlKey: true, metaKey: true, key: "d" },
};
const saveFile = {
  tool: function saveFile(state, baseurl, dispatch) {
    if (!state.currentfile) return;
    const fileurl = baseurl + state.currentdir + state.currentfile;
    fetch(fileurl, { method: "PUT", body: state.value }).then((resp) => {
      if (resp.ok) {
        dispatch({}, { refreshpreview: true });
      }
      console.log("saved");
    });
  },
  name: "save file",
  hotkey: { ctrlKey: true, metaKey: true, key: "s" },
};

const newFile = {
  tool: function newFile(state, baseurl, dispatch) {
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
  name: "new file",
  hotkey: { metaKey: true, ctrlKey: true, key: "b" },
};

// this.tools = [
//       {
//         tool: this.newfile,
//       },
//       {
//         tool: this.newdir,
//         hotkey: { metaKey: true, ctrlKey: true, shifKey: true, key: "b" },
//       },
//       {
//         tool: this.deletedir,
//         hotkey: { metaKey: true, ctrlKey: true, shifKey: true },
//         key: "d",
//       },
//     ];
function newDir(that) {
  const dirname = prompt("Enter directory name?");
  if (dirname === null) return;
  const dirurl = that.baseurl + that.state.dirname;
  fetch(dirurl, { method: "MKCOL" }).then((resp) => {
    if (resp.ok) {
      that.dispatch({}, { refreshdir: true });
    }
  });
}

export { deleteFile, saveFile, newFile, newDir };
