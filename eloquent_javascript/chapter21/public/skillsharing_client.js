function handleAction(state, action) {
  if (action.type == "setUser") {
    localStorage.setItem("userName", action.user);
    return { ...state, user: action.user };
  } else if (action.type == "setTalks") {
    return { ...state, talks: action.talks };
  } else if (action.type == "newTalk") {
    fetchOK(talkURL(action.title), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presenter: state.user, summary: action.summary }),
    }).catch(reportError);
  } else if (action.type == "deleteTalk") {
    fetchOK(talkURL(action.talk), { method: "DELETE" }).catch(reportError);
  } else if (action.type == "newComment") {
    fetchOK(talkURL(action.talk) + "/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: state.user, message: action.message }),
    }).catch(reportError);
  }
  return state;
}

async function fetchOK(url, options) {
  return fetch(url, options).then((response) => {
    if (response.status < 400) return response;
    else throw new Error(response.statusText);
  });
}

function talkURL(title) {
  return "talks/" + encodeURIComponent(title);
}

function reportError(error) {
  alert(String(error));
}

function elt(type, props, ...children) {
  const dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (const child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

function renderUserField(name, dispatch) {
  return elt(
    "label",
    null,
    "Your name: ",
    elt("input", {
      type: "text",
      value: name,
      onchange(event) {
        dispatch({ type: "setUser", user: event.target.value });
      },
    })
  );
}

function renderTalk(talk, dispatch) {
  return elt(
    "section",
    { className: "talk" },
    elt("h2", null, talk.title),
    elt(
      "button",
      {
        type: "button",
        onclick() {
          dispatch({ type: "deleteTalk", talk: talk.title });
        },
      },
      "Delete"
    ),
    elt("div", null, "by ", elt("strong", null, talk.presenter)),
    elt("p", null, talk.summary),
    ...talk.comments.map(renderComment),
    elt(
      "form",
      {
        onsubmit(event) {
          event.preventDefault();
          const form = event.target;
          dispatch({
            type: "newComment",
            talk: talk.title,
            message: form.elements.comment.value,
          });
          form.reset();
        },
      },
      elt("input", { type: "text", name: "comment" }, " "),
      elt("button", { type: "submit" }, "Add comment")
    )
  );
}

function renderComment(comment) {
  return elt(
    "p",
    { className: "comment" },
    elt("strong", null, comment.author),
    ":",
    comment.message
  );
}

function renderTalkForm(dispatch) {
  const title = elt("input", { type: "text" });
  const summary = elt("input", { type: "text" });
  return elt(
    "form",
    {
      onsubmit(event) {
        event.preventDefault();
        dispatch({
          type: "newTalk",
          title: title.value,
          summary: summary.value,
        });
        event.target.reset();
      },
    },
    elt("h3", null, "Submit a Talk"),
    elt("label", null, "Title:", title),
    elt("label", null, "Summary: ", summary),
    elt("button", { type: "submit" }, "Submit")
  );
}

async function pollTalks(update) {
  let tag = undefined;
  for (;;) {
    let response;
    try {
      response = await fetchOK("/talks", {
        headers: tag && { "If-None-Match": tag, Prefer: "wait=90" },
      });
    } catch (e) {
      console.log("Request failed" + e);
      await new Promise((resolve) => setTimeout(resolve, 500));
      continue;
    }
    if (response.status == 304) continue;
    tag = response.headers.get("Etag");
    update(await response.json());
  }
}

function updateComment(section, comments) {
  const comments_count_old = section.querySelectorAll(":scope > .comment")
    .length;
  const comment_form = section.querySelector(":scope > form");
  for (let i = comments_count_old; i < comments.length; i++) {
    section.insertBefore(renderComment(comments[i]), comment_form);
  }
}

class SkillShareApp {
  constructor(state, dispatch) {
    this.dispatch = dispatch;
    this.talkDOM = elt("div", { className: "talks" });
    this.dom = elt(
      "div",
      null,
      renderUserField(state.user, dispatch),
      this.talkDOM,
      renderTalkForm(dispatch)
    );
    this.syncState(state);
  }

  syncState(state) {
    if (state.talks != this.talks) {
      const children = this.talkDOM.children;
      if (state.talks.length == 0) {
        this.talkDOM.textContent = "";
      } else {
        for (let i = 0; i < state.talks.length; i++) {
          while (
            i < children.length &&
            children[i].firstChild.textContent != state.talks[i].title
          ) {
            this.talkDOM.removeChild(children[i]);
          }
          if (i < children.length) {
            updateComment(children[i], state.talks[i].comments);
          } else {
            this.talkDOM.appendChild(renderTalk(state.talks[i], this.dispatch));
          }
        }
      }
    }
    this.talks = state.talks;
  }
}

function runApp() {
  let user = localStorage.getItem("userName") || "Anon";
  let state, app;
  function dispatch(action) {
    state = handleAction(state, action);
    app.syncState(state);
  }
  pollTalks((talks) => {
    if (!app) {
      state = { user, talks };
      app = new SkillShareApp(state, dispatch);
      document.body.appendChild(app.dom);
    } else {
      dispatch({ type: "setTalks", talks });
    }
  }).catch(reportError);
}

runApp();
