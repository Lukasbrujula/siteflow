function m0(a, i) {
  for (var s = 0; s < i.length; s++) {
    const o = i[s];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const c in o)
        if (c !== "default" && !(c in a)) {
          const d = Object.getOwnPropertyDescriptor(o, c);
          d &&
            Object.defineProperty(
              a,
              c,
              d.get ? d : { enumerable: !0, get: () => o[c] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }),
  );
}
(function () {
  const i = document.createElement("link").relList;
  if (i && i.supports && i.supports("modulepreload")) return;
  for (const c of document.querySelectorAll('link[rel="modulepreload"]')) o(c);
  new MutationObserver((c) => {
    for (const d of c)
      if (d.type === "childList")
        for (const h of d.addedNodes)
          h.tagName === "LINK" && h.rel === "modulepreload" && o(h);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(c) {
    const d = {};
    return (
      c.integrity && (d.integrity = c.integrity),
      c.referrerPolicy && (d.referrerPolicy = c.referrerPolicy),
      c.crossOrigin === "use-credentials"
        ? (d.credentials = "include")
        : c.crossOrigin === "anonymous"
          ? (d.credentials = "omit")
          : (d.credentials = "same-origin"),
      d
    );
  }
  function o(c) {
    if (c.ep) return;
    c.ep = !0;
    const d = s(c);
    fetch(c.href, d);
  }
})();
function Pg(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default")
    ? a.default
    : a;
}
var fc = { exports: {} },
  Pi = {};
var ag;
function h0() {
  if (ag) return Pi;
  ag = 1;
  var a = Symbol.for("react.transitional.element"),
    i = Symbol.for("react.fragment");
  function s(o, c, d) {
    var h = null;
    if (
      (d !== void 0 && (h = "" + d),
      c.key !== void 0 && (h = "" + c.key),
      "key" in c)
    ) {
      d = {};
      for (var v in c) v !== "key" && (d[v] = c[v]);
    } else d = c;
    return (
      (c = d.ref),
      { $$typeof: a, type: o, key: h, ref: c !== void 0 ? c : null, props: d }
    );
  }
  return ((Pi.Fragment = i), (Pi.jsx = s), (Pi.jsxs = s), Pi);
}
var lg;
function g0() {
  return (lg || ((lg = 1), (fc.exports = h0())), fc.exports);
}
var f = g0(),
  dc = { exports: {} },
  fe = {};
var ig;
function p0() {
  if (ig) return fe;
  ig = 1;
  var a = Symbol.for("react.transitional.element"),
    i = Symbol.for("react.portal"),
    s = Symbol.for("react.fragment"),
    o = Symbol.for("react.strict_mode"),
    c = Symbol.for("react.profiler"),
    d = Symbol.for("react.consumer"),
    h = Symbol.for("react.context"),
    v = Symbol.for("react.forward_ref"),
    y = Symbol.for("react.suspense"),
    g = Symbol.for("react.memo"),
    S = Symbol.for("react.lazy"),
    p = Symbol.for("react.activity"),
    N = Symbol.iterator;
  function z(j) {
    return j === null || typeof j != "object"
      ? null
      : ((j = (N && j[N]) || j["@@iterator"]),
        typeof j == "function" ? j : null);
  }
  var A = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    E = Object.assign,
    _ = {};
  function C(j, q, Z) {
    ((this.props = j),
      (this.context = q),
      (this.refs = _),
      (this.updater = Z || A));
  }
  ((C.prototype.isReactComponent = {}),
    (C.prototype.setState = function (j, q) {
      if (typeof j != "object" && typeof j != "function" && j != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables.",
        );
      this.updater.enqueueSetState(this, j, q, "setState");
    }),
    (C.prototype.forceUpdate = function (j) {
      this.updater.enqueueForceUpdate(this, j, "forceUpdate");
    }));
  function X() {}
  X.prototype = C.prototype;
  function L(j, q, Z) {
    ((this.props = j),
      (this.context = q),
      (this.refs = _),
      (this.updater = Z || A));
  }
  var F = (L.prototype = new X());
  ((F.constructor = L), E(F, C.prototype), (F.isPureReactComponent = !0));
  var H = Array.isArray;
  function J() {}
  var B = { H: null, A: null, T: null, S: null },
    Y = Object.prototype.hasOwnProperty;
  function ee(j, q, Z) {
    var I = Z.ref;
    return {
      $$typeof: a,
      type: j,
      key: q,
      ref: I !== void 0 ? I : null,
      props: Z,
    };
  }
  function ye(j, q) {
    return ee(j.type, q, j.props);
  }
  function pe(j) {
    return typeof j == "object" && j !== null && j.$$typeof === a;
  }
  function Ee(j) {
    var q = { "=": "=0", ":": "=2" };
    return (
      "$" +
      j.replace(/[=:]/g, function (Z) {
        return q[Z];
      })
    );
  }
  var Le = /\/+/g;
  function Qe(j, q) {
    return typeof j == "object" && j !== null && j.key != null
      ? Ee("" + j.key)
      : q.toString(36);
  }
  function je(j) {
    switch (j.status) {
      case "fulfilled":
        return j.value;
      case "rejected":
        throw j.reason;
      default:
        switch (
          (typeof j.status == "string"
            ? j.then(J, J)
            : ((j.status = "pending"),
              j.then(
                function (q) {
                  j.status === "pending" &&
                    ((j.status = "fulfilled"), (j.value = q));
                },
                function (q) {
                  j.status === "pending" &&
                    ((j.status = "rejected"), (j.reason = q));
                },
              )),
          j.status)
        ) {
          case "fulfilled":
            return j.value;
          case "rejected":
            throw j.reason;
        }
    }
    throw j;
  }
  function M(j, q, Z, I, P) {
    var te = typeof j;
    (te === "undefined" || te === "boolean") && (j = null);
    var me = !1;
    if (j === null) me = !0;
    else
      switch (te) {
        case "bigint":
        case "string":
        case "number":
          me = !0;
          break;
        case "object":
          switch (j.$$typeof) {
            case a:
            case i:
              me = !0;
              break;
            case S:
              return ((me = j._init), M(me(j._payload), q, Z, I, P));
          }
      }
    if (me)
      return (
        (P = P(j)),
        (me = I === "" ? "." + Qe(j, 0) : I),
        H(P)
          ? ((Z = ""),
            me != null && (Z = me.replace(Le, "$&/") + "/"),
            M(P, q, Z, "", function (Gt) {
              return Gt;
            }))
          : P != null &&
            (pe(P) &&
              (P = ye(
                P,
                Z +
                  (P.key == null || (j && j.key === P.key)
                    ? ""
                    : ("" + P.key).replace(Le, "$&/") + "/") +
                  me,
              )),
            q.push(P)),
        1
      );
    me = 0;
    var de = I === "" ? "." : I + ":";
    if (H(j))
      for (var ue = 0; ue < j.length; ue++)
        ((I = j[ue]), (te = de + Qe(I, ue)), (me += M(I, q, Z, te, P)));
    else if (((ue = z(j)), typeof ue == "function"))
      for (j = ue.call(j), ue = 0; !(I = j.next()).done; )
        ((I = I.value), (te = de + Qe(I, ue++)), (me += M(I, q, Z, te, P)));
    else if (te === "object") {
      if (typeof j.then == "function") return M(je(j), q, Z, I, P);
      throw (
        (q = String(j)),
        Error(
          "Objects are not valid as a React child (found: " +
            (q === "[object Object]"
              ? "object with keys {" + Object.keys(j).join(", ") + "}"
              : q) +
            "). If you meant to render a collection of children, use an array instead.",
        )
      );
    }
    return me;
  }
  function K(j, q, Z) {
    if (j == null) return j;
    var I = [],
      P = 0;
    return (
      M(j, I, "", "", function (te) {
        return q.call(Z, te, P++);
      }),
      I
    );
  }
  function ie(j) {
    if (j._status === -1) {
      var q = j._result;
      ((q = q()),
        q.then(
          function (Z) {
            (j._status === 0 || j._status === -1) &&
              ((j._status = 1), (j._result = Z));
          },
          function (Z) {
            (j._status === 0 || j._status === -1) &&
              ((j._status = 2), (j._result = Z));
          },
        ),
        j._status === -1 && ((j._status = 0), (j._result = q)));
    }
    if (j._status === 1) return j._result.default;
    throw j._result;
  }
  var ve =
      typeof reportError == "function"
        ? reportError
        : function (j) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var q = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof j == "object" &&
                  j !== null &&
                  typeof j.message == "string"
                    ? String(j.message)
                    : String(j),
                error: j,
              });
              if (!window.dispatchEvent(q)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", j);
              return;
            }
            console.error(j);
          },
    W = {
      map: K,
      forEach: function (j, q, Z) {
        K(
          j,
          function () {
            q.apply(this, arguments);
          },
          Z,
        );
      },
      count: function (j) {
        var q = 0;
        return (
          K(j, function () {
            q++;
          }),
          q
        );
      },
      toArray: function (j) {
        return (
          K(j, function (q) {
            return q;
          }) || []
        );
      },
      only: function (j) {
        if (!pe(j))
          throw Error(
            "React.Children.only expected to receive a single React element child.",
          );
        return j;
      },
    };
  return (
    (fe.Activity = p),
    (fe.Children = W),
    (fe.Component = C),
    (fe.Fragment = s),
    (fe.Profiler = c),
    (fe.PureComponent = L),
    (fe.StrictMode = o),
    (fe.Suspense = y),
    (fe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = B),
    (fe.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (j) {
        return B.H.useMemoCache(j);
      },
    }),
    (fe.cache = function (j) {
      return function () {
        return j.apply(null, arguments);
      };
    }),
    (fe.cacheSignal = function () {
      return null;
    }),
    (fe.cloneElement = function (j, q, Z) {
      if (j == null)
        throw Error(
          "The argument must be a React element, but you passed " + j + ".",
        );
      var I = E({}, j.props),
        P = j.key;
      if (q != null)
        for (te in (q.key !== void 0 && (P = "" + q.key), q))
          !Y.call(q, te) ||
            te === "key" ||
            te === "__self" ||
            te === "__source" ||
            (te === "ref" && q.ref === void 0) ||
            (I[te] = q[te]);
      var te = arguments.length - 2;
      if (te === 1) I.children = Z;
      else if (1 < te) {
        for (var me = Array(te), de = 0; de < te; de++)
          me[de] = arguments[de + 2];
        I.children = me;
      }
      return ee(j.type, P, I);
    }),
    (fe.createContext = function (j) {
      return (
        (j = {
          $$typeof: h,
          _currentValue: j,
          _currentValue2: j,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (j.Provider = j),
        (j.Consumer = { $$typeof: d, _context: j }),
        j
      );
    }),
    (fe.createElement = function (j, q, Z) {
      var I,
        P = {},
        te = null;
      if (q != null)
        for (I in (q.key !== void 0 && (te = "" + q.key), q))
          Y.call(q, I) &&
            I !== "key" &&
            I !== "__self" &&
            I !== "__source" &&
            (P[I] = q[I]);
      var me = arguments.length - 2;
      if (me === 1) P.children = Z;
      else if (1 < me) {
        for (var de = Array(me), ue = 0; ue < me; ue++)
          de[ue] = arguments[ue + 2];
        P.children = de;
      }
      if (j && j.defaultProps)
        for (I in ((me = j.defaultProps), me))
          P[I] === void 0 && (P[I] = me[I]);
      return ee(j, te, P);
    }),
    (fe.createRef = function () {
      return { current: null };
    }),
    (fe.forwardRef = function (j) {
      return { $$typeof: v, render: j };
    }),
    (fe.isValidElement = pe),
    (fe.lazy = function (j) {
      return { $$typeof: S, _payload: { _status: -1, _result: j }, _init: ie };
    }),
    (fe.memo = function (j, q) {
      return { $$typeof: g, type: j, compare: q === void 0 ? null : q };
    }),
    (fe.startTransition = function (j) {
      var q = B.T,
        Z = {};
      B.T = Z;
      try {
        var I = j(),
          P = B.S;
        (P !== null && P(Z, I),
          typeof I == "object" &&
            I !== null &&
            typeof I.then == "function" &&
            I.then(J, ve));
      } catch (te) {
        ve(te);
      } finally {
        (q !== null && Z.types !== null && (q.types = Z.types), (B.T = q));
      }
    }),
    (fe.unstable_useCacheRefresh = function () {
      return B.H.useCacheRefresh();
    }),
    (fe.use = function (j) {
      return B.H.use(j);
    }),
    (fe.useActionState = function (j, q, Z) {
      return B.H.useActionState(j, q, Z);
    }),
    (fe.useCallback = function (j, q) {
      return B.H.useCallback(j, q);
    }),
    (fe.useContext = function (j) {
      return B.H.useContext(j);
    }),
    (fe.useDebugValue = function () {}),
    (fe.useDeferredValue = function (j, q) {
      return B.H.useDeferredValue(j, q);
    }),
    (fe.useEffect = function (j, q) {
      return B.H.useEffect(j, q);
    }),
    (fe.useEffectEvent = function (j) {
      return B.H.useEffectEvent(j);
    }),
    (fe.useId = function () {
      return B.H.useId();
    }),
    (fe.useImperativeHandle = function (j, q, Z) {
      return B.H.useImperativeHandle(j, q, Z);
    }),
    (fe.useInsertionEffect = function (j, q) {
      return B.H.useInsertionEffect(j, q);
    }),
    (fe.useLayoutEffect = function (j, q) {
      return B.H.useLayoutEffect(j, q);
    }),
    (fe.useMemo = function (j, q) {
      return B.H.useMemo(j, q);
    }),
    (fe.useOptimistic = function (j, q) {
      return B.H.useOptimistic(j, q);
    }),
    (fe.useReducer = function (j, q, Z) {
      return B.H.useReducer(j, q, Z);
    }),
    (fe.useRef = function (j) {
      return B.H.useRef(j);
    }),
    (fe.useState = function (j) {
      return B.H.useState(j);
    }),
    (fe.useSyncExternalStore = function (j, q, Z) {
      return B.H.useSyncExternalStore(j, q, Z);
    }),
    (fe.useTransition = function () {
      return B.H.useTransition();
    }),
    (fe.version = "19.2.5"),
    fe
  );
}
var rg;
function Uc() {
  return (rg || ((rg = 1), (dc.exports = p0())), dc.exports);
}
var b = Uc();
const $ = Pg(b),
  ep = m0({ __proto__: null, default: $ }, [b]);
var mc = { exports: {} },
  er = {},
  hc = { exports: {} },
  gc = {};
var sg;
function v0() {
  return (
    sg ||
      ((sg = 1),
      (function (a) {
        function i(M, K) {
          var ie = M.length;
          M.push(K);
          e: for (; 0 < ie; ) {
            var ve = (ie - 1) >>> 1,
              W = M[ve];
            if (0 < c(W, K)) ((M[ve] = K), (M[ie] = W), (ie = ve));
            else break e;
          }
        }
        function s(M) {
          return M.length === 0 ? null : M[0];
        }
        function o(M) {
          if (M.length === 0) return null;
          var K = M[0],
            ie = M.pop();
          if (ie !== K) {
            M[0] = ie;
            e: for (var ve = 0, W = M.length, j = W >>> 1; ve < j; ) {
              var q = 2 * (ve + 1) - 1,
                Z = M[q],
                I = q + 1,
                P = M[I];
              if (0 > c(Z, ie))
                I < W && 0 > c(P, Z)
                  ? ((M[ve] = P), (M[I] = ie), (ve = I))
                  : ((M[ve] = Z), (M[q] = ie), (ve = q));
              else if (I < W && 0 > c(P, ie))
                ((M[ve] = P), (M[I] = ie), (ve = I));
              else break e;
            }
          }
          return K;
        }
        function c(M, K) {
          var ie = M.sortIndex - K.sortIndex;
          return ie !== 0 ? ie : M.id - K.id;
        }
        if (
          ((a.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var d = performance;
          a.unstable_now = function () {
            return d.now();
          };
        } else {
          var h = Date,
            v = h.now();
          a.unstable_now = function () {
            return h.now() - v;
          };
        }
        var y = [],
          g = [],
          S = 1,
          p = null,
          N = 3,
          z = !1,
          A = !1,
          E = !1,
          _ = !1,
          C = typeof setTimeout == "function" ? setTimeout : null,
          X = typeof clearTimeout == "function" ? clearTimeout : null,
          L = typeof setImmediate < "u" ? setImmediate : null;
        function F(M) {
          for (var K = s(g); K !== null; ) {
            if (K.callback === null) o(g);
            else if (K.startTime <= M)
              (o(g), (K.sortIndex = K.expirationTime), i(y, K));
            else break;
            K = s(g);
          }
        }
        function H(M) {
          if (((E = !1), F(M), !A))
            if (s(y) !== null) ((A = !0), J || ((J = !0), Ee()));
            else {
              var K = s(g);
              K !== null && je(H, K.startTime - M);
            }
        }
        var J = !1,
          B = -1,
          Y = 5,
          ee = -1;
        function ye() {
          return _ ? !0 : !(a.unstable_now() - ee < Y);
        }
        function pe() {
          if (((_ = !1), J)) {
            var M = a.unstable_now();
            ee = M;
            var K = !0;
            try {
              e: {
                ((A = !1), E && ((E = !1), X(B), (B = -1)), (z = !0));
                var ie = N;
                try {
                  t: {
                    for (
                      F(M), p = s(y);
                      p !== null && !(p.expirationTime > M && ye());
                    ) {
                      var ve = p.callback;
                      if (typeof ve == "function") {
                        ((p.callback = null), (N = p.priorityLevel));
                        var W = ve(p.expirationTime <= M);
                        if (((M = a.unstable_now()), typeof W == "function")) {
                          ((p.callback = W), F(M), (K = !0));
                          break t;
                        }
                        (p === s(y) && o(y), F(M));
                      } else o(y);
                      p = s(y);
                    }
                    if (p !== null) K = !0;
                    else {
                      var j = s(g);
                      (j !== null && je(H, j.startTime - M), (K = !1));
                    }
                  }
                  break e;
                } finally {
                  ((p = null), (N = ie), (z = !1));
                }
                K = void 0;
              }
            } finally {
              K ? Ee() : (J = !1);
            }
          }
        }
        var Ee;
        if (typeof L == "function")
          Ee = function () {
            L(pe);
          };
        else if (typeof MessageChannel < "u") {
          var Le = new MessageChannel(),
            Qe = Le.port2;
          ((Le.port1.onmessage = pe),
            (Ee = function () {
              Qe.postMessage(null);
            }));
        } else
          Ee = function () {
            C(pe, 0);
          };
        function je(M, K) {
          B = C(function () {
            M(a.unstable_now());
          }, K);
        }
        ((a.unstable_IdlePriority = 5),
          (a.unstable_ImmediatePriority = 1),
          (a.unstable_LowPriority = 4),
          (a.unstable_NormalPriority = 3),
          (a.unstable_Profiling = null),
          (a.unstable_UserBlockingPriority = 2),
          (a.unstable_cancelCallback = function (M) {
            M.callback = null;
          }),
          (a.unstable_forceFrameRate = function (M) {
            0 > M || 125 < M
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
                )
              : (Y = 0 < M ? Math.floor(1e3 / M) : 5);
          }),
          (a.unstable_getCurrentPriorityLevel = function () {
            return N;
          }),
          (a.unstable_next = function (M) {
            switch (N) {
              case 1:
              case 2:
              case 3:
                var K = 3;
                break;
              default:
                K = N;
            }
            var ie = N;
            N = K;
            try {
              return M();
            } finally {
              N = ie;
            }
          }),
          (a.unstable_requestPaint = function () {
            _ = !0;
          }),
          (a.unstable_runWithPriority = function (M, K) {
            switch (M) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                M = 3;
            }
            var ie = N;
            N = M;
            try {
              return K();
            } finally {
              N = ie;
            }
          }),
          (a.unstable_scheduleCallback = function (M, K, ie) {
            var ve = a.unstable_now();
            switch (
              (typeof ie == "object" && ie !== null
                ? ((ie = ie.delay),
                  (ie = typeof ie == "number" && 0 < ie ? ve + ie : ve))
                : (ie = ve),
              M)
            ) {
              case 1:
                var W = -1;
                break;
              case 2:
                W = 250;
                break;
              case 5:
                W = 1073741823;
                break;
              case 4:
                W = 1e4;
                break;
              default:
                W = 5e3;
            }
            return (
              (W = ie + W),
              (M = {
                id: S++,
                callback: K,
                priorityLevel: M,
                startTime: ie,
                expirationTime: W,
                sortIndex: -1,
              }),
              ie > ve
                ? ((M.sortIndex = ie),
                  i(g, M),
                  s(y) === null &&
                    M === s(g) &&
                    (E ? (X(B), (B = -1)) : (E = !0), je(H, ie - ve)))
                : ((M.sortIndex = W),
                  i(y, M),
                  A || z || ((A = !0), J || ((J = !0), Ee()))),
              M
            );
          }),
          (a.unstable_shouldYield = ye),
          (a.unstable_wrapCallback = function (M) {
            var K = N;
            return function () {
              var ie = N;
              N = K;
              try {
                return M.apply(this, arguments);
              } finally {
                N = ie;
              }
            };
          }));
      })(gc)),
    gc
  );
}
var og;
function b0() {
  return (og || ((og = 1), (hc.exports = v0())), hc.exports);
}
var pc = { exports: {} },
  St = {};
var ug;
function y0() {
  if (ug) return St;
  ug = 1;
  var a = Uc();
  function i(y) {
    var g = "https://react.dev/errors/" + y;
    if (1 < arguments.length) {
      g += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var S = 2; S < arguments.length; S++)
        g += "&args[]=" + encodeURIComponent(arguments[S]);
    }
    return (
      "Minified React error #" +
      y +
      "; visit " +
      g +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function s() {}
  var o = {
      d: {
        f: s,
        r: function () {
          throw Error(i(522));
        },
        D: s,
        C: s,
        L: s,
        m: s,
        X: s,
        S: s,
        M: s,
      },
      p: 0,
      findDOMNode: null,
    },
    c = Symbol.for("react.portal");
  function d(y, g, S) {
    var p =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: p == null ? null : "" + p,
      children: y,
      containerInfo: g,
      implementation: S,
    };
  }
  var h = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function v(y, g) {
    if (y === "font") return "";
    if (typeof g == "string") return g === "use-credentials" ? g : "";
  }
  return (
    (St.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = o),
    (St.createPortal = function (y, g) {
      var S =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!g || (g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11))
        throw Error(i(299));
      return d(y, g, null, S);
    }),
    (St.flushSync = function (y) {
      var g = h.T,
        S = o.p;
      try {
        if (((h.T = null), (o.p = 2), y)) return y();
      } finally {
        ((h.T = g), (o.p = S), o.d.f());
      }
    }),
    (St.preconnect = function (y, g) {
      typeof y == "string" &&
        (g
          ? ((g = g.crossOrigin),
            (g =
              typeof g == "string"
                ? g === "use-credentials"
                  ? g
                  : ""
                : void 0))
          : (g = null),
        o.d.C(y, g));
    }),
    (St.prefetchDNS = function (y) {
      typeof y == "string" && o.d.D(y);
    }),
    (St.preinit = function (y, g) {
      if (typeof y == "string" && g && typeof g.as == "string") {
        var S = g.as,
          p = v(S, g.crossOrigin),
          N = typeof g.integrity == "string" ? g.integrity : void 0,
          z = typeof g.fetchPriority == "string" ? g.fetchPriority : void 0;
        S === "style"
          ? o.d.S(y, typeof g.precedence == "string" ? g.precedence : void 0, {
              crossOrigin: p,
              integrity: N,
              fetchPriority: z,
            })
          : S === "script" &&
            o.d.X(y, {
              crossOrigin: p,
              integrity: N,
              fetchPriority: z,
              nonce: typeof g.nonce == "string" ? g.nonce : void 0,
            });
      }
    }),
    (St.preinitModule = function (y, g) {
      if (typeof y == "string")
        if (typeof g == "object" && g !== null) {
          if (g.as == null || g.as === "script") {
            var S = v(g.as, g.crossOrigin);
            o.d.M(y, {
              crossOrigin: S,
              integrity: typeof g.integrity == "string" ? g.integrity : void 0,
              nonce: typeof g.nonce == "string" ? g.nonce : void 0,
            });
          }
        } else g == null && o.d.M(y);
    }),
    (St.preload = function (y, g) {
      if (
        typeof y == "string" &&
        typeof g == "object" &&
        g !== null &&
        typeof g.as == "string"
      ) {
        var S = g.as,
          p = v(S, g.crossOrigin);
        o.d.L(y, S, {
          crossOrigin: p,
          integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          nonce: typeof g.nonce == "string" ? g.nonce : void 0,
          type: typeof g.type == "string" ? g.type : void 0,
          fetchPriority:
            typeof g.fetchPriority == "string" ? g.fetchPriority : void 0,
          referrerPolicy:
            typeof g.referrerPolicy == "string" ? g.referrerPolicy : void 0,
          imageSrcSet:
            typeof g.imageSrcSet == "string" ? g.imageSrcSet : void 0,
          imageSizes: typeof g.imageSizes == "string" ? g.imageSizes : void 0,
          media: typeof g.media == "string" ? g.media : void 0,
        });
      }
    }),
    (St.preloadModule = function (y, g) {
      if (typeof y == "string")
        if (g) {
          var S = v(g.as, g.crossOrigin);
          o.d.m(y, {
            as: typeof g.as == "string" && g.as !== "script" ? g.as : void 0,
            crossOrigin: S,
            integrity: typeof g.integrity == "string" ? g.integrity : void 0,
          });
        } else o.d.m(y);
    }),
    (St.requestFormReset = function (y) {
      o.d.r(y);
    }),
    (St.unstable_batchedUpdates = function (y, g) {
      return y(g);
    }),
    (St.useFormState = function (y, g, S) {
      return h.H.useFormState(y, g, S);
    }),
    (St.useFormStatus = function () {
      return h.H.useHostTransitionStatus();
    }),
    (St.version = "19.2.5"),
    St
  );
}
var cg;
function tp() {
  if (cg) return pc.exports;
  cg = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return (a(), (pc.exports = y0()), pc.exports);
}
var fg;
function x0() {
  if (fg) return er;
  fg = 1;
  var a = b0(),
    i = Uc(),
    s = tp();
  function o(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        t += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return (
      "Minified React error #" +
      e +
      "; visit " +
      t +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function c(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function d(e) {
    var t = e,
      n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do ((t = e), (t.flags & 4098) !== 0 && (n = t.return), (e = t.return));
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function h(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function v(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (
        (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
        t !== null)
      )
        return t.dehydrated;
    }
    return null;
  }
  function y(e) {
    if (d(e) !== e) throw Error(o(188));
  }
  function g(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = d(e)), t === null)) throw Error(o(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ; ) {
      var r = n.return;
      if (r === null) break;
      var u = r.alternate;
      if (u === null) {
        if (((l = r.return), l !== null)) {
          n = l;
          continue;
        }
        break;
      }
      if (r.child === u.child) {
        for (u = r.child; u; ) {
          if (u === n) return (y(r), e);
          if (u === l) return (y(r), t);
          u = u.sibling;
        }
        throw Error(o(188));
      }
      if (n.return !== l.return) ((n = r), (l = u));
      else {
        for (var m = !1, x = r.child; x; ) {
          if (x === n) {
            ((m = !0), (n = r), (l = u));
            break;
          }
          if (x === l) {
            ((m = !0), (l = r), (n = u));
            break;
          }
          x = x.sibling;
        }
        if (!m) {
          for (x = u.child; x; ) {
            if (x === n) {
              ((m = !0), (n = u), (l = r));
              break;
            }
            if (x === l) {
              ((m = !0), (l = u), (n = r));
              break;
            }
            x = x.sibling;
          }
          if (!m) throw Error(o(189));
        }
      }
      if (n.alternate !== l) throw Error(o(190));
    }
    if (n.tag !== 3) throw Error(o(188));
    return n.stateNode.current === n ? e : t;
  }
  function S(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (((t = S(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  var p = Object.assign,
    N = Symbol.for("react.element"),
    z = Symbol.for("react.transitional.element"),
    A = Symbol.for("react.portal"),
    E = Symbol.for("react.fragment"),
    _ = Symbol.for("react.strict_mode"),
    C = Symbol.for("react.profiler"),
    X = Symbol.for("react.consumer"),
    L = Symbol.for("react.context"),
    F = Symbol.for("react.forward_ref"),
    H = Symbol.for("react.suspense"),
    J = Symbol.for("react.suspense_list"),
    B = Symbol.for("react.memo"),
    Y = Symbol.for("react.lazy"),
    ee = Symbol.for("react.activity"),
    ye = Symbol.for("react.memo_cache_sentinel"),
    pe = Symbol.iterator;
  function Ee(e) {
    return e === null || typeof e != "object"
      ? null
      : ((e = (pe && e[pe]) || e["@@iterator"]),
        typeof e == "function" ? e : null);
  }
  var Le = Symbol.for("react.client.reference");
  function Qe(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === Le ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case E:
        return "Fragment";
      case C:
        return "Profiler";
      case _:
        return "StrictMode";
      case H:
        return "Suspense";
      case J:
        return "SuspenseList";
      case ee:
        return "Activity";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case A:
          return "Portal";
        case L:
          return e.displayName || "Context";
        case X:
          return (e._context.displayName || "Context") + ".Consumer";
        case F:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ""),
              (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
            e
          );
        case B:
          return (
            (t = e.displayName || null),
            t !== null ? t : Qe(e.type) || "Memo"
          );
        case Y:
          ((t = e._payload), (e = e._init));
          try {
            return Qe(e(t));
          } catch {}
      }
    return null;
  }
  var je = Array.isArray,
    M = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    K = s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    ie = { pending: !1, data: null, method: null, action: null },
    ve = [],
    W = -1;
  function j(e) {
    return { current: e };
  }
  function q(e) {
    0 > W || ((e.current = ve[W]), (ve[W] = null), W--);
  }
  function Z(e, t) {
    (W++, (ve[W] = e.current), (e.current = t));
  }
  var I = j(null),
    P = j(null),
    te = j(null),
    me = j(null);
  function de(e, t) {
    switch ((Z(te, t), Z(P, e), Z(I, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? jh(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI)))
          ((t = jh(t)), (e = Th(t, e)));
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (q(I), Z(I, e));
  }
  function ue() {
    (q(I), q(P), q(te));
  }
  function Gt(e) {
    e.memoizedState !== null && Z(me, e);
    var t = I.current,
      n = Th(t, e.type);
    t !== n && (Z(P, e), Z(I, n));
  }
  function Ct(e) {
    (P.current === e && (q(I), q(P)),
      me.current === e && (q(me), ($i._currentValue = ie)));
  }
  var wt, In;
  function bt(e) {
    if (wt === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ((wt = (t && t[1]) || ""),
          (In =
            -1 <
            n.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < n.stack.indexOf("@")
                ? "@unknown:0:0"
                : ""));
      }
    return (
      `
` +
      wt +
      e +
      In
    );
  }
  var li = !1;
  function il(e, t) {
    if (!e || li) return "";
    li = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var Q = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(Q.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(Q, []);
                } catch (U) {
                  var k = U;
                }
                Reflect.construct(e, [], Q);
              } else {
                try {
                  Q.call();
                } catch (U) {
                  k = U;
                }
                e.call(Q.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (U) {
                k = U;
              }
              (Q = e()) &&
                typeof Q.catch == "function" &&
                Q.catch(function () {});
            }
          } catch (U) {
            if (U && k && typeof U.stack == "string") return [U.stack, k.stack];
          }
          return [null, null];
        },
      };
      l.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var r = Object.getOwnPropertyDescriptor(
        l.DetermineComponentFrameRoot,
        "name",
      );
      r &&
        r.configurable &&
        Object.defineProperty(l.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var u = l.DetermineComponentFrameRoot(),
        m = u[0],
        x = u[1];
      if (m && x) {
        var w = m.split(`
`),
          O = x.split(`
`);
        for (
          r = l = 0;
          l < w.length && !w[l].includes("DetermineComponentFrameRoot");
        )
          l++;
        for (; r < O.length && !O[r].includes("DetermineComponentFrameRoot"); )
          r++;
        if (l === w.length || r === O.length)
          for (
            l = w.length - 1, r = O.length - 1;
            1 <= l && 0 <= r && w[l] !== O[r];
          )
            r--;
        for (; 1 <= l && 0 <= r; l--, r--)
          if (w[l] !== O[r]) {
            if (l !== 1 || r !== 1)
              do
                if ((l--, r--, 0 > r || w[l] !== O[r])) {
                  var G =
                    `
` + w[l].replace(" at new ", " at ");
                  return (
                    e.displayName &&
                      G.includes("<anonymous>") &&
                      (G = G.replace("<anonymous>", e.displayName)),
                    G
                  );
                }
              while (1 <= l && 0 <= r);
            break;
          }
      }
    } finally {
      ((li = !1), (Error.prepareStackTrace = n));
    }
    return (n = e ? e.displayName || e.name : "") ? bt(n) : "";
  }
  function za(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return bt(e.type);
      case 16:
        return bt("Lazy");
      case 13:
        return e.child !== t && t !== null
          ? bt("Suspense Fallback")
          : bt("Suspense");
      case 19:
        return bt("SuspenseList");
      case 0:
      case 15:
        return il(e.type, !1);
      case 11:
        return il(e.type.render, !1);
      case 1:
        return il(e.type, !0);
      case 31:
        return bt("Activity");
      default:
        return "";
    }
  }
  function ii(e) {
    try {
      var t = "",
        n = null;
      do ((t += za(e, n)), (n = e), (e = e.return));
      while (e);
      return t;
    } catch (l) {
      return (
        `
Error generating stack: ` +
        l.message +
        `
` +
        l.stack
      );
    }
  }
  var Yt = Object.prototype.hasOwnProperty,
    ri = a.unstable_scheduleCallback,
    si = a.unstable_cancelCallback,
    Nt = a.unstable_shouldYield,
    Pn = a.unstable_requestPaint,
    _t = a.unstable_now,
    Is = a.unstable_getCurrentPriorityLevel,
    Ma = a.unstable_ImmediatePriority,
    dr = a.unstable_UserBlockingPriority,
    Da = a.unstable_NormalPriority,
    oi = a.unstable_LowPriority,
    _n = a.unstable_IdlePriority,
    mr = a.log,
    ea = a.unstable_setDisableYieldValue,
    Oa = null,
    jt = null;
  function on(e) {
    if (
      (typeof mr == "function" && ea(e),
      jt && typeof jt.setStrictMode == "function")
    )
      try {
        jt.setStrictMode(Oa, e);
      } catch {}
  }
  var yt = Math.clz32 ? Math.clz32 : hn,
    Ps = Math.log,
    ui = Math.LN2;
  function hn(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((Ps(e) / ui) | 0)) | 0);
  }
  var rl = 256,
    sl = 262144,
    ka = 4194304;
  function gn(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function ce(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var r = 0,
      u = e.suspendedLanes,
      m = e.pingedLanes;
    e = e.warmLanes;
    var x = l & 134217727;
    return (
      x !== 0
        ? ((l = x & ~u),
          l !== 0
            ? (r = gn(l))
            : ((m &= x),
              m !== 0
                ? (r = gn(m))
                : n || ((n = x & ~e), n !== 0 && (r = gn(n)))))
        : ((x = l & ~u),
          x !== 0
            ? (r = gn(x))
            : m !== 0
              ? (r = gn(m))
              : n || ((n = l & ~e), n !== 0 && (r = gn(n)))),
      r === 0
        ? 0
        : t !== 0 &&
            t !== r &&
            (t & u) === 0 &&
            ((u = r & -r),
            (n = t & -t),
            u >= n || (u === 32 && (n & 4194048) !== 0))
          ? t
          : r
    );
  }
  function Ge(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function rt(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function xt() {
    var e = ka;
    return ((ka <<= 1), (ka & 62914560) === 0 && (ka = 4194304), e);
  }
  function ta(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Ve(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 &&
        ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function At(e, t, n, l, r, u) {
    var m = e.pendingLanes;
    ((e.pendingLanes = n),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= n),
      (e.entangledLanes &= n),
      (e.errorRecoveryDisabledLanes &= n),
      (e.shellSuspendCounter = 0));
    var x = e.entanglements,
      w = e.expirationTimes,
      O = e.hiddenUpdates;
    for (n = m & ~n; 0 < n; ) {
      var G = 31 - yt(n),
        Q = 1 << G;
      ((x[G] = 0), (w[G] = -1));
      var k = O[G];
      if (k !== null)
        for (O[G] = null, G = 0; G < k.length; G++) {
          var U = k[G];
          U !== null && (U.lane &= -536870913);
        }
      n &= ~Q;
    }
    (l !== 0 && Ua(e, l, 0),
      u !== 0 && r === 0 && e.tag !== 0 && (e.suspendedLanes |= u & ~(m & ~t)));
  }
  function Ua(e, t, n) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var l = 31 - yt(t);
    ((e.entangledLanes |= t),
      (e.entanglements[l] = e.entanglements[l] | 1073741824 | (n & 261930)));
  }
  function Rt(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n; ) {
      var l = 31 - yt(n),
        r = 1 << l;
      ((r & t) | (e[l] & t) && (e[l] |= t), (n &= ~r));
    }
  }
  function zt(e, t) {
    var n = t & -t;
    return (
      (n = (n & 42) !== 0 ? 1 : ol(n)),
      (n & (e.suspendedLanes | t)) !== 0 ? 0 : n
    );
  }
  function ol(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function un(e) {
    return (
      (e &= -e),
      2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function eo() {
    var e = K.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : Fh(e.type));
  }
  function df(e, t) {
    var n = K.p;
    try {
      return ((K.p = e), t());
    } finally {
      K.p = n;
    }
  }
  var na = Math.random().toString(36).slice(2),
    ct = "__reactFiber$" + na,
    Mt = "__reactProps$" + na,
    ul = "__reactContainer$" + na,
    to = "__reactEvents$" + na,
    nb = "__reactListeners$" + na,
    ab = "__reactHandles$" + na,
    mf = "__reactResources$" + na,
    ci = "__reactMarker$" + na;
  function no(e) {
    (delete e[ct], delete e[Mt], delete e[to], delete e[nb], delete e[ab]);
  }
  function cl(e) {
    var t = e[ct];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if ((t = n[ul] || n[ct])) {
        if (
          ((n = t.alternate),
          t.child !== null || (n !== null && n.child !== null))
        )
          for (e = Oh(e); e !== null; ) {
            if ((n = e[ct])) return n;
            e = Oh(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function fl(e) {
    if ((e = e[ct] || e[ul])) {
      var t = e.tag;
      if (
        t === 5 ||
        t === 6 ||
        t === 13 ||
        t === 31 ||
        t === 26 ||
        t === 27 ||
        t === 3
      )
        return e;
    }
    return null;
  }
  function fi(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(o(33));
  }
  function dl(e) {
    var t = e[mf];
    return (
      t ||
        (t = e[mf] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      t
    );
  }
  function st(e) {
    e[ci] = !0;
  }
  var hf = new Set(),
    gf = {};
  function La(e, t) {
    (ml(e, t), ml(e + "Capture", t));
  }
  function ml(e, t) {
    for (gf[e] = t, e = 0; e < t.length; e++) hf.add(t[e]);
  }
  var lb = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$",
    ),
    pf = {},
    vf = {};
  function ib(e) {
    return Yt.call(vf, e)
      ? !0
      : Yt.call(pf, e)
        ? !1
        : lb.test(e)
          ? (vf[e] = !0)
          : ((pf[e] = !0), !1);
  }
  function hr(e, t, n) {
    if (ib(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var l = t.toLowerCase().slice(0, 5);
            if (l !== "data-" && l !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, "" + n);
      }
  }
  function gr(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, "" + n);
    }
  }
  function jn(e, t, n, l) {
    if (l === null) e.removeAttribute(n);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, "" + l);
    }
  }
  function Ft(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function bf(e) {
    var t = e.type;
    return (
      (e = e.nodeName) &&
      e.toLowerCase() === "input" &&
      (t === "checkbox" || t === "radio")
    );
  }
  function rb(e, t, n) {
    var l = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof l < "u" &&
      typeof l.get == "function" &&
      typeof l.set == "function"
    ) {
      var r = l.get,
        u = l.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return r.call(this);
          },
          set: function (m) {
            ((n = "" + m), u.call(this, m));
          },
        }),
        Object.defineProperty(e, t, { enumerable: l.enumerable }),
        {
          getValue: function () {
            return n;
          },
          setValue: function (m) {
            n = "" + m;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function ao(e) {
    if (!e._valueTracker) {
      var t = bf(e) ? "checked" : "value";
      e._valueTracker = rb(e, t, "" + e[t]);
    }
  }
  function yf(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      l = "";
    return (
      e && (l = bf(e) ? (e.checked ? "true" : "false") : e.value),
      (e = l),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  function pr(e) {
    if (
      ((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u")
    )
      return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  var sb = /[\n"\\]/g;
  function Wt(e) {
    return e.replace(sb, function (t) {
      return "\\" + t.charCodeAt(0).toString(16) + " ";
    });
  }
  function lo(e, t, n, l, r, u, m, x) {
    ((e.name = ""),
      m != null &&
      typeof m != "function" &&
      typeof m != "symbol" &&
      typeof m != "boolean"
        ? (e.type = m)
        : e.removeAttribute("type"),
      t != null
        ? m === "number"
          ? ((t === 0 && e.value === "") || e.value != t) &&
            (e.value = "" + Ft(t))
          : e.value !== "" + Ft(t) && (e.value = "" + Ft(t))
        : (m !== "submit" && m !== "reset") || e.removeAttribute("value"),
      t != null
        ? io(e, m, Ft(t))
        : n != null
          ? io(e, m, Ft(n))
          : l != null && e.removeAttribute("value"),
      r == null && u != null && (e.defaultChecked = !!u),
      r != null &&
        (e.checked = r && typeof r != "function" && typeof r != "symbol"),
      x != null &&
      typeof x != "function" &&
      typeof x != "symbol" &&
      typeof x != "boolean"
        ? (e.name = "" + Ft(x))
        : e.removeAttribute("name"));
  }
  function xf(e, t, n, l, r, u, m, x) {
    if (
      (u != null &&
        typeof u != "function" &&
        typeof u != "symbol" &&
        typeof u != "boolean" &&
        (e.type = u),
      t != null || n != null)
    ) {
      if (!((u !== "submit" && u !== "reset") || t != null)) {
        ao(e);
        return;
      }
      ((n = n != null ? "" + Ft(n) : ""),
        (t = t != null ? "" + Ft(t) : n),
        x || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((l = l ?? r),
      (l = typeof l != "function" && typeof l != "symbol" && !!l),
      (e.checked = x ? e.checked : !!l),
      (e.defaultChecked = !!l),
      m != null &&
        typeof m != "function" &&
        typeof m != "symbol" &&
        typeof m != "boolean" &&
        (e.name = m),
      ao(e));
  }
  function io(e, t, n) {
    (t === "number" && pr(e.ownerDocument) === e) ||
      e.defaultValue === "" + n ||
      (e.defaultValue = "" + n);
  }
  function hl(e, t, n, l) {
    if (((e = e.options), t)) {
      t = {};
      for (var r = 0; r < n.length; r++) t["$" + n[r]] = !0;
      for (n = 0; n < e.length; n++)
        ((r = t.hasOwnProperty("$" + e[n].value)),
          e[n].selected !== r && (e[n].selected = r),
          r && l && (e[n].defaultSelected = !0));
    } else {
      for (n = "" + Ft(n), t = null, r = 0; r < e.length; r++) {
        if (e[r].value === n) {
          ((e[r].selected = !0), l && (e[r].defaultSelected = !0));
          return;
        }
        t !== null || e[r].disabled || (t = e[r]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Sf(e, t, n) {
    if (
      t != null &&
      ((t = "" + Ft(t)), t !== e.value && (e.value = t), n == null)
    ) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? "" + Ft(n) : "";
  }
  function Ef(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(o(92));
        if (je(l)) {
          if (1 < l.length) throw Error(o(93));
          l = l[0];
        }
        n = l;
      }
      (n == null && (n = ""), (t = n));
    }
    ((n = Ft(t)),
      (e.defaultValue = n),
      (l = e.textContent),
      l === n && l !== "" && l !== null && (e.value = l),
      ao(e));
  }
  function gl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var ob = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " ",
    ),
  );
  function wf(e, t, n) {
    var l = t.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === ""
      ? l
        ? e.setProperty(t, "")
        : t === "float"
          ? (e.cssFloat = "")
          : (e[t] = "")
      : l
        ? e.setProperty(t, n)
        : typeof n != "number" || n === 0 || ob.has(t)
          ? t === "float"
            ? (e.cssFloat = n)
            : (e[t] = ("" + n).trim())
          : (e[t] = n + "px");
  }
  function Nf(e, t, n) {
    if (t != null && typeof t != "object") throw Error(o(62));
    if (((e = e.style), n != null)) {
      for (var l in n)
        !n.hasOwnProperty(l) ||
          (t != null && t.hasOwnProperty(l)) ||
          (l.indexOf("--") === 0
            ? e.setProperty(l, "")
            : l === "float"
              ? (e.cssFloat = "")
              : (e[l] = ""));
      for (var r in t)
        ((l = t[r]), t.hasOwnProperty(r) && n[r] !== l && wf(e, r, l));
    } else for (var u in t) t.hasOwnProperty(u) && wf(e, u, t[u]);
  }
  function ro(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var ub = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    cb =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function vr(e) {
    return cb.test("" + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function Tn() {}
  var so = null;
  function oo(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var pl = null,
    vl = null;
  function _f(e) {
    var t = fl(e);
    if (t && (e = t.stateNode)) {
      var n = e[Mt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case "input":
          if (
            (lo(
              e,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (t = n.name),
            n.type === "radio" && t != null)
          ) {
            for (n = e; n.parentNode; ) n = n.parentNode;
            for (
              n = n.querySelectorAll(
                'input[name="' + Wt("" + t) + '"][type="radio"]',
              ),
                t = 0;
              t < n.length;
              t++
            ) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var r = l[Mt] || null;
                if (!r) throw Error(o(90));
                lo(
                  l,
                  r.value,
                  r.defaultValue,
                  r.defaultValue,
                  r.checked,
                  r.defaultChecked,
                  r.type,
                  r.name,
                );
              }
            }
            for (t = 0; t < n.length; t++)
              ((l = n[t]), l.form === e.form && yf(l));
          }
          break e;
        case "textarea":
          Sf(e, n.value, n.defaultValue);
          break e;
        case "select":
          ((t = n.value), t != null && hl(e, !!n.multiple, t, !1));
      }
    }
  }
  var uo = !1;
  function jf(e, t, n) {
    if (uo) return e(t, n);
    uo = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (
        ((uo = !1),
        (pl !== null || vl !== null) &&
          (ls(), pl && ((t = pl), (e = vl), (vl = pl = null), _f(t), e)))
      )
        for (t = 0; t < e.length; t++) _f(e[t]);
    }
  }
  function di(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[Mt] || null;
    if (l === null) return null;
    n = l[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        ((l = !l.disabled) ||
          ((e = e.type),
          (l = !(
            e === "button" ||
            e === "input" ||
            e === "select" ||
            e === "textarea"
          ))),
          (e = !l));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(o(231, t, typeof n));
    return n;
  }
  var Cn = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    co = !1;
  if (Cn)
    try {
      var mi = {};
      (Object.defineProperty(mi, "passive", {
        get: function () {
          co = !0;
        },
      }),
        window.addEventListener("test", mi, mi),
        window.removeEventListener("test", mi, mi));
    } catch {
      co = !1;
    }
  var aa = null,
    fo = null,
    br = null;
  function Tf() {
    if (br) return br;
    var e,
      t = fo,
      n = t.length,
      l,
      r = "value" in aa ? aa.value : aa.textContent,
      u = r.length;
    for (e = 0; e < n && t[e] === r[e]; e++);
    var m = n - e;
    for (l = 1; l <= m && t[n - l] === r[u - l]; l++);
    return (br = r.slice(e, 1 < l ? 1 - l : void 0));
  }
  function yr(e) {
    var t = e.keyCode;
    return (
      "charCode" in e
        ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
        : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function xr() {
    return !0;
  }
  function Cf() {
    return !1;
  }
  function Dt(e) {
    function t(n, l, r, u, m) {
      ((this._reactName = n),
        (this._targetInst = r),
        (this.type = l),
        (this.nativeEvent = u),
        (this.target = m),
        (this.currentTarget = null));
      for (var x in e)
        e.hasOwnProperty(x) && ((n = e[x]), (this[x] = n ? n(u) : u[x]));
      return (
        (this.isDefaultPrevented = (
          u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1
        )
          ? xr
          : Cf),
        (this.isPropagationStopped = Cf),
        this
      );
    }
    return (
      p(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != "unknown" && (n.returnValue = !1),
            (this.isDefaultPrevented = xr));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
            (this.isPropagationStopped = xr));
        },
        persist: function () {},
        isPersistent: xr,
      }),
      t
    );
  }
  var Ba = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Sr = Dt(Ba),
    hi = p({}, Ba, { view: 0, detail: 0 }),
    fb = Dt(hi),
    mo,
    ho,
    gi,
    Er = p({}, hi, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: po,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e
          ? e.movementX
          : (e !== gi &&
              (gi && e.type === "mousemove"
                ? ((mo = e.screenX - gi.screenX), (ho = e.screenY - gi.screenY))
                : (ho = mo = 0),
              (gi = e)),
            mo);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : ho;
      },
    }),
    Af = Dt(Er),
    db = p({}, Er, { dataTransfer: 0 }),
    mb = Dt(db),
    hb = p({}, hi, { relatedTarget: 0 }),
    go = Dt(hb),
    gb = p({}, Ba, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    pb = Dt(gb),
    vb = p({}, Ba, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      },
    }),
    bb = Dt(vb),
    yb = p({}, Ba, { data: 0 }),
    Rf = Dt(yb),
    xb = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    Sb = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    Eb = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function wb(e) {
    var t = this.nativeEvent;
    return t.getModifierState
      ? t.getModifierState(e)
      : (e = Eb[e])
        ? !!t[e]
        : !1;
  }
  function po() {
    return wb;
  }
  var Nb = p({}, hi, {
      key: function (e) {
        if (e.key) {
          var t = xb[e.key] || e.key;
          if (t !== "Unidentified") return t;
        }
        return e.type === "keypress"
          ? ((e = yr(e)), e === 13 ? "Enter" : String.fromCharCode(e))
          : e.type === "keydown" || e.type === "keyup"
            ? Sb[e.keyCode] || "Unidentified"
            : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: po,
      charCode: function (e) {
        return e.type === "keypress" ? yr(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress"
          ? yr(e)
          : e.type === "keydown" || e.type === "keyup"
            ? e.keyCode
            : 0;
      },
    }),
    _b = Dt(Nb),
    jb = p({}, Er, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    zf = Dt(jb),
    Tb = p({}, hi, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: po,
    }),
    Cb = Dt(Tb),
    Ab = p({}, Ba, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Rb = Dt(Ab),
    zb = p({}, Er, {
      deltaX: function (e) {
        return "deltaX" in e
          ? e.deltaX
          : "wheelDeltaX" in e
            ? -e.wheelDeltaX
            : 0;
      },
      deltaY: function (e) {
        return "deltaY" in e
          ? e.deltaY
          : "wheelDeltaY" in e
            ? -e.wheelDeltaY
            : "wheelDelta" in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Mb = Dt(zb),
    Db = p({}, Ba, { newState: 0, oldState: 0 }),
    Ob = Dt(Db),
    kb = [9, 13, 27, 32],
    vo = Cn && "CompositionEvent" in window,
    pi = null;
  Cn && "documentMode" in document && (pi = document.documentMode);
  var Ub = Cn && "TextEvent" in window && !pi,
    Mf = Cn && (!vo || (pi && 8 < pi && 11 >= pi)),
    Df = " ",
    Of = !1;
  function kf(e, t) {
    switch (e) {
      case "keyup":
        return kb.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Uf(e) {
    return (
      (e = e.detail),
      typeof e == "object" && "data" in e ? e.data : null
    );
  }
  var bl = !1;
  function Lb(e, t) {
    switch (e) {
      case "compositionend":
        return Uf(t);
      case "keypress":
        return t.which !== 32 ? null : ((Of = !0), Df);
      case "textInput":
        return ((e = t.data), e === Df && Of ? null : e);
      default:
        return null;
    }
  }
  function Bb(e, t) {
    if (bl)
      return e === "compositionend" || (!vo && kf(e, t))
        ? ((e = Tf()), (br = fo = aa = null), (bl = !1), e)
        : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Mf && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var Hb = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function Lf(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!Hb[e.type] : t === "textarea";
  }
  function Bf(e, t, n, l) {
    (pl ? (vl ? vl.push(l) : (vl = [l])) : (pl = l),
      (t = fs(t, "onChange")),
      0 < t.length &&
        ((n = new Sr("onChange", "change", null, n, l)),
        e.push({ event: n, listeners: t })));
  }
  var vi = null,
    bi = null;
  function Gb(e) {
    xh(e, 0);
  }
  function wr(e) {
    var t = fi(e);
    if (yf(t)) return e;
  }
  function Hf(e, t) {
    if (e === "change") return t;
  }
  var Gf = !1;
  if (Cn) {
    var bo;
    if (Cn) {
      var yo = "oninput" in document;
      if (!yo) {
        var Yf = document.createElement("div");
        (Yf.setAttribute("oninput", "return;"),
          (yo = typeof Yf.oninput == "function"));
      }
      bo = yo;
    } else bo = !1;
    Gf = bo && (!document.documentMode || 9 < document.documentMode);
  }
  function qf() {
    vi && (vi.detachEvent("onpropertychange", Vf), (bi = vi = null));
  }
  function Vf(e) {
    if (e.propertyName === "value" && wr(bi)) {
      var t = [];
      (Bf(t, bi, e, oo(e)), jf(Gb, t));
    }
  }
  function Yb(e, t, n) {
    e === "focusin"
      ? (qf(), (vi = t), (bi = n), vi.attachEvent("onpropertychange", Vf))
      : e === "focusout" && qf();
  }
  function qb(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return wr(bi);
  }
  function Vb(e, t) {
    if (e === "click") return wr(t);
  }
  function Xb(e, t) {
    if (e === "input" || e === "change") return wr(t);
  }
  function Qb(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var qt = typeof Object.is == "function" ? Object.is : Qb;
  function yi(e, t) {
    if (qt(e, t)) return !0;
    if (
      typeof e != "object" ||
      e === null ||
      typeof t != "object" ||
      t === null
    )
      return !1;
    var n = Object.keys(e),
      l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var r = n[l];
      if (!Yt.call(t, r) || !qt(e[r], t[r])) return !1;
    }
    return !0;
  }
  function Xf(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Qf(e, t) {
    var n = Xf(e);
    e = 0;
    for (var l; n; ) {
      if (n.nodeType === 3) {
        if (((l = e + n.textContent.length), e <= t && l >= t))
          return { node: n, offset: t - e };
        e = l;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = Xf(n);
    }
  }
  function Zf(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? Zf(e, t.parentNode)
            : "contains" in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function Kf(e) {
    e =
      e != null &&
      e.ownerDocument != null &&
      e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = pr(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = pr(e.document);
    }
    return t;
  }
  function xo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === "input" &&
        (e.type === "text" ||
          e.type === "search" ||
          e.type === "tel" ||
          e.type === "url" ||
          e.type === "password")) ||
        t === "textarea" ||
        e.contentEditable === "true")
    );
  }
  var Zb = Cn && "documentMode" in document && 11 >= document.documentMode,
    yl = null,
    So = null,
    xi = null,
    Eo = !1;
  function Jf(e, t, n) {
    var l =
      n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Eo ||
      yl == null ||
      yl !== pr(l) ||
      ((l = yl),
      "selectionStart" in l && xo(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = (
            (l.ownerDocument && l.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      (xi && yi(xi, l)) ||
        ((xi = l),
        (l = fs(So, "onSelect")),
        0 < l.length &&
          ((t = new Sr("onSelect", "select", null, t, n)),
          e.push({ event: t, listeners: l }),
          (t.target = yl))));
  }
  function Ha(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n["Webkit" + e] = "webkit" + t),
      (n["Moz" + e] = "moz" + t),
      n
    );
  }
  var xl = {
      animationend: Ha("Animation", "AnimationEnd"),
      animationiteration: Ha("Animation", "AnimationIteration"),
      animationstart: Ha("Animation", "AnimationStart"),
      transitionrun: Ha("Transition", "TransitionRun"),
      transitionstart: Ha("Transition", "TransitionStart"),
      transitioncancel: Ha("Transition", "TransitionCancel"),
      transitionend: Ha("Transition", "TransitionEnd"),
    },
    wo = {},
    $f = {};
  Cn &&
    (($f = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete xl.animationend.animation,
      delete xl.animationiteration.animation,
      delete xl.animationstart.animation),
    "TransitionEvent" in window || delete xl.transitionend.transition);
  function Ga(e) {
    if (wo[e]) return wo[e];
    if (!xl[e]) return e;
    var t = xl[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in $f) return (wo[e] = t[n]);
    return e;
  }
  var Ff = Ga("animationend"),
    Wf = Ga("animationiteration"),
    If = Ga("animationstart"),
    Kb = Ga("transitionrun"),
    Jb = Ga("transitionstart"),
    $b = Ga("transitioncancel"),
    Pf = Ga("transitionend"),
    ed = new Map(),
    No =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " ",
      );
  No.push("scrollEnd");
  function cn(e, t) {
    (ed.set(e, t), La(t, [e]));
  }
  var Nr =
      typeof reportError == "function"
        ? reportError
        : function (e) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var t = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == "object" &&
                  e !== null &&
                  typeof e.message == "string"
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", e);
              return;
            }
            console.error(e);
          },
    It = [],
    Sl = 0,
    _o = 0;
  function _r() {
    for (var e = Sl, t = (_o = Sl = 0); t < e; ) {
      var n = It[t];
      It[t++] = null;
      var l = It[t];
      It[t++] = null;
      var r = It[t];
      It[t++] = null;
      var u = It[t];
      if (((It[t++] = null), l !== null && r !== null)) {
        var m = l.pending;
        (m === null ? (r.next = r) : ((r.next = m.next), (m.next = r)),
          (l.pending = r));
      }
      u !== 0 && td(n, r, u);
    }
  }
  function jr(e, t, n, l) {
    ((It[Sl++] = e),
      (It[Sl++] = t),
      (It[Sl++] = n),
      (It[Sl++] = l),
      (_o |= l),
      (e.lanes |= l),
      (e = e.alternate),
      e !== null && (e.lanes |= l));
  }
  function jo(e, t, n, l) {
    return (jr(e, t, n, l), Tr(e));
  }
  function Ya(e, t) {
    return (jr(e, null, null, t), Tr(e));
  }
  function td(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var r = !1, u = e.return; u !== null; )
      ((u.childLanes |= n),
        (l = u.alternate),
        l !== null && (l.childLanes |= n),
        u.tag === 22 &&
          ((e = u.stateNode), e === null || e._visibility & 1 || (r = !0)),
        (e = u),
        (u = u.return));
    return e.tag === 3
      ? ((u = e.stateNode),
        r &&
          t !== null &&
          ((r = 31 - yt(n)),
          (e = u.hiddenUpdates),
          (l = e[r]),
          l === null ? (e[r] = [t]) : l.push(t),
          (t.lane = n | 536870912)),
        u)
      : null;
  }
  function Tr(e) {
    if (50 < qi) throw ((qi = 0), (ku = null), Error(o(185)));
    for (var t = e.return; t !== null; ) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var El = {};
  function Fb(e, t, n, l) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function Vt(e, t, n, l) {
    return new Fb(e, t, n, l);
  }
  function To(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function An(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = Vt(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 65011712),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies =
        t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      (n.refCleanup = e.refCleanup),
      n
    );
  }
  function nd(e, t) {
    e.flags &= 65011714;
    var n = e.alternate;
    return (
      n === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = n.childLanes),
          (e.lanes = n.lanes),
          (e.child = n.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = n.memoizedProps),
          (e.memoizedState = n.memoizedState),
          (e.updateQueue = n.updateQueue),
          (e.type = n.type),
          (t = n.dependencies),
          (e.dependencies =
            t === null
              ? null
              : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function Cr(e, t, n, l, r, u) {
    var m = 0;
    if (((l = e), typeof e == "function")) To(e) && (m = 1);
    else if (typeof e == "string")
      m = t0(e, n, I.current)
        ? 26
        : e === "html" || e === "head" || e === "body"
          ? 27
          : 5;
    else
      e: switch (e) {
        case ee:
          return (
            (e = Vt(31, n, t, r)),
            (e.elementType = ee),
            (e.lanes = u),
            e
          );
        case E:
          return qa(n.children, r, u, t);
        case _:
          ((m = 8), (r |= 24));
          break;
        case C:
          return (
            (e = Vt(12, n, t, r | 2)),
            (e.elementType = C),
            (e.lanes = u),
            e
          );
        case H:
          return ((e = Vt(13, n, t, r)), (e.elementType = H), (e.lanes = u), e);
        case J:
          return ((e = Vt(19, n, t, r)), (e.elementType = J), (e.lanes = u), e);
        default:
          if (typeof e == "object" && e !== null)
            switch (e.$$typeof) {
              case L:
                m = 10;
                break e;
              case X:
                m = 9;
                break e;
              case F:
                m = 11;
                break e;
              case B:
                m = 14;
                break e;
              case Y:
                ((m = 16), (l = null));
                break e;
            }
          ((m = 29),
            (n = Error(o(130, e === null ? "null" : typeof e, ""))),
            (l = null));
      }
    return (
      (t = Vt(m, n, t, r)),
      (t.elementType = e),
      (t.type = l),
      (t.lanes = u),
      t
    );
  }
  function qa(e, t, n, l) {
    return ((e = Vt(7, e, l, t)), (e.lanes = n), e);
  }
  function Co(e, t, n) {
    return ((e = Vt(6, e, null, t)), (e.lanes = n), e);
  }
  function ad(e) {
    var t = Vt(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function Ao(e, t, n) {
    return (
      (t = Vt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var ld = new WeakMap();
  function Pt(e, t) {
    if (typeof e == "object" && e !== null) {
      var n = ld.get(e);
      return n !== void 0
        ? n
        : ((t = { value: e, source: t, stack: ii(t) }), ld.set(e, t), t);
    }
    return { value: e, source: t, stack: ii(t) };
  }
  var wl = [],
    Nl = 0,
    Ar = null,
    Si = 0,
    en = [],
    tn = 0,
    la = null,
    pn = 1,
    vn = "";
  function Rn(e, t) {
    ((wl[Nl++] = Si), (wl[Nl++] = Ar), (Ar = e), (Si = t));
  }
  function id(e, t, n) {
    ((en[tn++] = pn), (en[tn++] = vn), (en[tn++] = la), (la = e));
    var l = pn;
    e = vn;
    var r = 32 - yt(l) - 1;
    ((l &= ~(1 << r)), (n += 1));
    var u = 32 - yt(t) + r;
    if (30 < u) {
      var m = r - (r % 5);
      ((u = (l & ((1 << m) - 1)).toString(32)),
        (l >>= m),
        (r -= m),
        (pn = (1 << (32 - yt(t) + r)) | (n << r) | l),
        (vn = u + e));
    } else ((pn = (1 << u) | (n << r) | l), (vn = e));
  }
  function Ro(e) {
    e.return !== null && (Rn(e, 1), id(e, 1, 0));
  }
  function zo(e) {
    for (; e === Ar; )
      ((Ar = wl[--Nl]), (wl[Nl] = null), (Si = wl[--Nl]), (wl[Nl] = null));
    for (; e === la; )
      ((la = en[--tn]),
        (en[tn] = null),
        (vn = en[--tn]),
        (en[tn] = null),
        (pn = en[--tn]),
        (en[tn] = null));
  }
  function rd(e, t) {
    ((en[tn++] = pn),
      (en[tn++] = vn),
      (en[tn++] = la),
      (pn = t.id),
      (vn = t.overflow),
      (la = e));
  }
  var ft = null,
    Be = null,
    Te = !1,
    ia = null,
    nn = !1,
    Mo = Error(o(519));
  function ra(e) {
    var t = Error(
      o(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1]
          ? "text"
          : "HTML",
        "",
      ),
    );
    throw (Ei(Pt(t, e)), Mo);
  }
  function sd(e) {
    var t = e.stateNode,
      n = e.type,
      l = e.memoizedProps;
    switch (((t[ct] = e), (t[Mt] = l), n)) {
      case "dialog":
        (Se("cancel", t), Se("close", t));
        break;
      case "iframe":
      case "object":
      case "embed":
        Se("load", t);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Xi.length; n++) Se(Xi[n], t);
        break;
      case "source":
        Se("error", t);
        break;
      case "img":
      case "image":
      case "link":
        (Se("error", t), Se("load", t));
        break;
      case "details":
        Se("toggle", t);
        break;
      case "input":
        (Se("invalid", t),
          xf(
            t,
            l.value,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name,
            !0,
          ));
        break;
      case "select":
        Se("invalid", t);
        break;
      case "textarea":
        (Se("invalid", t), Ef(t, l.value, l.defaultValue, l.children));
    }
    ((n = l.children),
      (typeof n != "string" && typeof n != "number" && typeof n != "bigint") ||
      t.textContent === "" + n ||
      l.suppressHydrationWarning === !0 ||
      Nh(t.textContent, n)
        ? (l.popover != null && (Se("beforetoggle", t), Se("toggle", t)),
          l.onScroll != null && Se("scroll", t),
          l.onScrollEnd != null && Se("scrollend", t),
          l.onClick != null && (t.onclick = Tn),
          (t = !0))
        : (t = !1),
      t || ra(e, !0));
  }
  function od(e) {
    for (ft = e.return; ft; )
      switch (ft.tag) {
        case 5:
        case 31:
        case 13:
          nn = !1;
          return;
        case 27:
        case 3:
          nn = !0;
          return;
        default:
          ft = ft.return;
      }
  }
  function _l(e) {
    if (e !== ft) return !1;
    if (!Te) return (od(e), (Te = !0), !1);
    var t = e.tag,
      n;
    if (
      ((n = t !== 3 && t !== 27) &&
        ((n = t === 5) &&
          ((n = e.type),
          (n =
            !(n !== "form" && n !== "button") || Fu(e.type, e.memoizedProps))),
        (n = !n)),
      n && Be && ra(e),
      od(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(o(317));
      Be = Dh(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
        throw Error(o(317));
      Be = Dh(e);
    } else
      t === 27
        ? ((t = Be), xa(e.type) ? ((e = tc), (tc = null), (Be = e)) : (Be = t))
        : (Be = ft ? ln(e.stateNode.nextSibling) : null);
    return !0;
  }
  function Va() {
    ((Be = ft = null), (Te = !1));
  }
  function Do() {
    var e = ia;
    return (
      e !== null &&
        (Lt === null ? (Lt = e) : Lt.push.apply(Lt, e), (ia = null)),
      e
    );
  }
  function Ei(e) {
    ia === null ? (ia = [e]) : ia.push(e);
  }
  var Oo = j(null),
    Xa = null,
    zn = null;
  function sa(e, t, n) {
    (Z(Oo, t._currentValue), (t._currentValue = n));
  }
  function Mn(e) {
    ((e._currentValue = Oo.current), q(Oo));
  }
  function ko(e, t, n) {
    for (; e !== null; ) {
      var l = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), l !== null && (l.childLanes |= t))
          : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function Uo(e, t, n, l) {
    var r = e.child;
    for (r !== null && (r.return = e); r !== null; ) {
      var u = r.dependencies;
      if (u !== null) {
        var m = r.child;
        u = u.firstContext;
        e: for (; u !== null; ) {
          var x = u;
          u = r;
          for (var w = 0; w < t.length; w++)
            if (x.context === t[w]) {
              ((u.lanes |= n),
                (x = u.alternate),
                x !== null && (x.lanes |= n),
                ko(u.return, n, e),
                l || (m = null));
              break e;
            }
          u = x.next;
        }
      } else if (r.tag === 18) {
        if (((m = r.return), m === null)) throw Error(o(341));
        ((m.lanes |= n),
          (u = m.alternate),
          u !== null && (u.lanes |= n),
          ko(m, n, e),
          (m = null));
      } else m = r.child;
      if (m !== null) m.return = r;
      else
        for (m = r; m !== null; ) {
          if (m === e) {
            m = null;
            break;
          }
          if (((r = m.sibling), r !== null)) {
            ((r.return = m.return), (m = r));
            break;
          }
          m = m.return;
        }
      r = m;
    }
  }
  function jl(e, t, n, l) {
    e = null;
    for (var r = t, u = !1; r !== null; ) {
      if (!u) {
        if ((r.flags & 524288) !== 0) u = !0;
        else if ((r.flags & 262144) !== 0) break;
      }
      if (r.tag === 10) {
        var m = r.alternate;
        if (m === null) throw Error(o(387));
        if (((m = m.memoizedProps), m !== null)) {
          var x = r.type;
          qt(r.pendingProps.value, m.value) ||
            (e !== null ? e.push(x) : (e = [x]));
        }
      } else if (r === me.current) {
        if (((m = r.alternate), m === null)) throw Error(o(387));
        m.memoizedState.memoizedState !== r.memoizedState.memoizedState &&
          (e !== null ? e.push($i) : (e = [$i]));
      }
      r = r.return;
    }
    (e !== null && Uo(t, e, n, l), (t.flags |= 262144));
  }
  function Rr(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!qt(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function Qa(e) {
    ((Xa = e),
      (zn = null),
      (e = e.dependencies),
      e !== null && (e.firstContext = null));
  }
  function dt(e) {
    return ud(Xa, e);
  }
  function zr(e, t) {
    return (Xa === null && Qa(e), ud(e, t));
  }
  function ud(e, t) {
    var n = t._currentValue;
    if (((t = { context: t, memoizedValue: n, next: null }), zn === null)) {
      if (e === null) throw Error(o(308));
      ((zn = t),
        (e.dependencies = { lanes: 0, firstContext: t }),
        (e.flags |= 524288));
    } else zn = zn.next = t;
    return n;
  }
  var Wb =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (n, l) {
                  e.push(l);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (n) {
                  return n();
                }));
            };
          },
    Ib = a.unstable_scheduleCallback,
    Pb = a.unstable_NormalPriority,
    Ie = {
      $$typeof: L,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Lo() {
    return { controller: new Wb(), data: new Map(), refCount: 0 };
  }
  function wi(e) {
    (e.refCount--,
      e.refCount === 0 &&
        Ib(Pb, function () {
          e.controller.abort();
        }));
  }
  var Ni = null,
    Bo = 0,
    Tl = 0,
    Cl = null;
  function ey(e, t) {
    if (Ni === null) {
      var n = (Ni = []);
      ((Bo = 0),
        (Tl = Yu()),
        (Cl = {
          status: "pending",
          value: void 0,
          then: function (l) {
            n.push(l);
          },
        }));
    }
    return (Bo++, t.then(cd, cd), t);
  }
  function cd() {
    if (--Bo === 0 && Ni !== null) {
      Cl !== null && (Cl.status = "fulfilled");
      var e = Ni;
      ((Ni = null), (Tl = 0), (Cl = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function ty(e, t) {
    var n = [],
      l = {
        status: "pending",
        value: null,
        reason: null,
        then: function (r) {
          n.push(r);
        },
      };
    return (
      e.then(
        function () {
          ((l.status = "fulfilled"), (l.value = t));
          for (var r = 0; r < n.length; r++) (0, n[r])(t);
        },
        function (r) {
          for (l.status = "rejected", l.reason = r, r = 0; r < n.length; r++)
            (0, n[r])(void 0);
        },
      ),
      l
    );
  }
  var fd = M.S;
  M.S = function (e, t) {
    ((Jm = _t()),
      typeof t == "object" &&
        t !== null &&
        typeof t.then == "function" &&
        ey(e, t),
      fd !== null && fd(e, t));
  };
  var Za = j(null);
  function Ho() {
    var e = Za.current;
    return e !== null ? e : Ue.pooledCache;
  }
  function Mr(e, t) {
    t === null ? Z(Za, Za.current) : Z(Za, t.pool);
  }
  function dd() {
    var e = Ho();
    return e === null ? null : { parent: Ie._currentValue, pool: e };
  }
  var Al = Error(o(460)),
    Go = Error(o(474)),
    Dr = Error(o(542)),
    Or = { then: function () {} };
  function md(e) {
    return ((e = e.status), e === "fulfilled" || e === "rejected");
  }
  function hd(e, t, n) {
    switch (
      ((n = e[n]),
      n === void 0 ? e.push(t) : n !== t && (t.then(Tn, Tn), (t = n)),
      t.status)
    ) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw ((e = t.reason), pd(e), e);
      default:
        if (typeof t.status == "string") t.then(Tn, Tn);
        else {
          if (((e = Ue), e !== null && 100 < e.shellSuspendCounter))
            throw Error(o(482));
          ((e = t),
            (e.status = "pending"),
            e.then(
              function (l) {
                if (t.status === "pending") {
                  var r = t;
                  ((r.status = "fulfilled"), (r.value = l));
                }
              },
              function (l) {
                if (t.status === "pending") {
                  var r = t;
                  ((r.status = "rejected"), (r.reason = l));
                }
              },
            ));
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw ((e = t.reason), pd(e), e);
        }
        throw ((Ja = t), Al);
    }
  }
  function Ka(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function"
        ? ((Ja = n), Al)
        : n;
    }
  }
  var Ja = null;
  function gd() {
    if (Ja === null) throw Error(o(459));
    var e = Ja;
    return ((Ja = null), e);
  }
  function pd(e) {
    if (e === Al || e === Dr) throw Error(o(483));
  }
  var Rl = null,
    _i = 0;
  function kr(e) {
    var t = _i;
    return ((_i += 1), Rl === null && (Rl = []), hd(Rl, e, t));
  }
  function ji(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function Ur(e, t) {
    throw t.$$typeof === N
      ? Error(o(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          o(
            31,
            e === "[object Object]"
              ? "object with keys {" + Object.keys(t).join(", ") + "}"
              : e,
          ),
        ));
  }
  function vd(e) {
    function t(R, T) {
      if (e) {
        var D = R.deletions;
        D === null ? ((R.deletions = [T]), (R.flags |= 16)) : D.push(T);
      }
    }
    function n(R, T) {
      if (!e) return null;
      for (; T !== null; ) (t(R, T), (T = T.sibling));
      return null;
    }
    function l(R) {
      for (var T = new Map(); R !== null; )
        (R.key !== null ? T.set(R.key, R) : T.set(R.index, R), (R = R.sibling));
      return T;
    }
    function r(R, T) {
      return ((R = An(R, T)), (R.index = 0), (R.sibling = null), R);
    }
    function u(R, T, D) {
      return (
        (R.index = D),
        e
          ? ((D = R.alternate),
            D !== null
              ? ((D = D.index), D < T ? ((R.flags |= 67108866), T) : D)
              : ((R.flags |= 67108866), T))
          : ((R.flags |= 1048576), T)
      );
    }
    function m(R) {
      return (e && R.alternate === null && (R.flags |= 67108866), R);
    }
    function x(R, T, D, V) {
      return T === null || T.tag !== 6
        ? ((T = Co(D, R.mode, V)), (T.return = R), T)
        : ((T = r(T, D)), (T.return = R), T);
    }
    function w(R, T, D, V) {
      var se = D.type;
      return se === E
        ? G(R, T, D.props.children, V, D.key)
        : T !== null &&
            (T.elementType === se ||
              (typeof se == "object" &&
                se !== null &&
                se.$$typeof === Y &&
                Ka(se) === T.type))
          ? ((T = r(T, D.props)), ji(T, D), (T.return = R), T)
          : ((T = Cr(D.type, D.key, D.props, null, R.mode, V)),
            ji(T, D),
            (T.return = R),
            T);
    }
    function O(R, T, D, V) {
      return T === null ||
        T.tag !== 4 ||
        T.stateNode.containerInfo !== D.containerInfo ||
        T.stateNode.implementation !== D.implementation
        ? ((T = Ao(D, R.mode, V)), (T.return = R), T)
        : ((T = r(T, D.children || [])), (T.return = R), T);
    }
    function G(R, T, D, V, se) {
      return T === null || T.tag !== 7
        ? ((T = qa(D, R.mode, V, se)), (T.return = R), T)
        : ((T = r(T, D)), (T.return = R), T);
    }
    function Q(R, T, D) {
      if (
        (typeof T == "string" && T !== "") ||
        typeof T == "number" ||
        typeof T == "bigint"
      )
        return ((T = Co("" + T, R.mode, D)), (T.return = R), T);
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case z:
            return (
              (D = Cr(T.type, T.key, T.props, null, R.mode, D)),
              ji(D, T),
              (D.return = R),
              D
            );
          case A:
            return ((T = Ao(T, R.mode, D)), (T.return = R), T);
          case Y:
            return ((T = Ka(T)), Q(R, T, D));
        }
        if (je(T) || Ee(T))
          return ((T = qa(T, R.mode, D, null)), (T.return = R), T);
        if (typeof T.then == "function") return Q(R, kr(T), D);
        if (T.$$typeof === L) return Q(R, zr(R, T), D);
        Ur(R, T);
      }
      return null;
    }
    function k(R, T, D, V) {
      var se = T !== null ? T.key : null;
      if (
        (typeof D == "string" && D !== "") ||
        typeof D == "number" ||
        typeof D == "bigint"
      )
        return se !== null ? null : x(R, T, "" + D, V);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case z:
            return D.key === se ? w(R, T, D, V) : null;
          case A:
            return D.key === se ? O(R, T, D, V) : null;
          case Y:
            return ((D = Ka(D)), k(R, T, D, V));
        }
        if (je(D) || Ee(D)) return se !== null ? null : G(R, T, D, V, null);
        if (typeof D.then == "function") return k(R, T, kr(D), V);
        if (D.$$typeof === L) return k(R, T, zr(R, D), V);
        Ur(R, D);
      }
      return null;
    }
    function U(R, T, D, V, se) {
      if (
        (typeof V == "string" && V !== "") ||
        typeof V == "number" ||
        typeof V == "bigint"
      )
        return ((R = R.get(D) || null), x(T, R, "" + V, se));
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case z:
            return (
              (R = R.get(V.key === null ? D : V.key) || null),
              w(T, R, V, se)
            );
          case A:
            return (
              (R = R.get(V.key === null ? D : V.key) || null),
              O(T, R, V, se)
            );
          case Y:
            return ((V = Ka(V)), U(R, T, D, V, se));
        }
        if (je(V) || Ee(V))
          return ((R = R.get(D) || null), G(T, R, V, se, null));
        if (typeof V.then == "function") return U(R, T, D, kr(V), se);
        if (V.$$typeof === L) return U(R, T, D, zr(T, V), se);
        Ur(T, V);
      }
      return null;
    }
    function ne(R, T, D, V) {
      for (
        var se = null, Ce = null, re = T, ge = (T = 0), Ne = null;
        re !== null && ge < D.length;
        ge++
      ) {
        re.index > ge ? ((Ne = re), (re = null)) : (Ne = re.sibling);
        var Ae = k(R, re, D[ge], V);
        if (Ae === null) {
          re === null && (re = Ne);
          break;
        }
        (e && re && Ae.alternate === null && t(R, re),
          (T = u(Ae, T, ge)),
          Ce === null ? (se = Ae) : (Ce.sibling = Ae),
          (Ce = Ae),
          (re = Ne));
      }
      if (ge === D.length) return (n(R, re), Te && Rn(R, ge), se);
      if (re === null) {
        for (; ge < D.length; ge++)
          ((re = Q(R, D[ge], V)),
            re !== null &&
              ((T = u(re, T, ge)),
              Ce === null ? (se = re) : (Ce.sibling = re),
              (Ce = re)));
        return (Te && Rn(R, ge), se);
      }
      for (re = l(re); ge < D.length; ge++)
        ((Ne = U(re, R, ge, D[ge], V)),
          Ne !== null &&
            (e &&
              Ne.alternate !== null &&
              re.delete(Ne.key === null ? ge : Ne.key),
            (T = u(Ne, T, ge)),
            Ce === null ? (se = Ne) : (Ce.sibling = Ne),
            (Ce = Ne)));
      return (
        e &&
          re.forEach(function (_a) {
            return t(R, _a);
          }),
        Te && Rn(R, ge),
        se
      );
    }
    function oe(R, T, D, V) {
      if (D == null) throw Error(o(151));
      for (
        var se = null,
          Ce = null,
          re = T,
          ge = (T = 0),
          Ne = null,
          Ae = D.next();
        re !== null && !Ae.done;
        ge++, Ae = D.next()
      ) {
        re.index > ge ? ((Ne = re), (re = null)) : (Ne = re.sibling);
        var _a = k(R, re, Ae.value, V);
        if (_a === null) {
          re === null && (re = Ne);
          break;
        }
        (e && re && _a.alternate === null && t(R, re),
          (T = u(_a, T, ge)),
          Ce === null ? (se = _a) : (Ce.sibling = _a),
          (Ce = _a),
          (re = Ne));
      }
      if (Ae.done) return (n(R, re), Te && Rn(R, ge), se);
      if (re === null) {
        for (; !Ae.done; ge++, Ae = D.next())
          ((Ae = Q(R, Ae.value, V)),
            Ae !== null &&
              ((T = u(Ae, T, ge)),
              Ce === null ? (se = Ae) : (Ce.sibling = Ae),
              (Ce = Ae)));
        return (Te && Rn(R, ge), se);
      }
      for (re = l(re); !Ae.done; ge++, Ae = D.next())
        ((Ae = U(re, R, ge, Ae.value, V)),
          Ae !== null &&
            (e &&
              Ae.alternate !== null &&
              re.delete(Ae.key === null ? ge : Ae.key),
            (T = u(Ae, T, ge)),
            Ce === null ? (se = Ae) : (Ce.sibling = Ae),
            (Ce = Ae)));
      return (
        e &&
          re.forEach(function (d0) {
            return t(R, d0);
          }),
        Te && Rn(R, ge),
        se
      );
    }
    function ke(R, T, D, V) {
      if (
        (typeof D == "object" &&
          D !== null &&
          D.type === E &&
          D.key === null &&
          (D = D.props.children),
        typeof D == "object" && D !== null)
      ) {
        switch (D.$$typeof) {
          case z:
            e: {
              for (var se = D.key; T !== null; ) {
                if (T.key === se) {
                  if (((se = D.type), se === E)) {
                    if (T.tag === 7) {
                      (n(R, T.sibling),
                        (V = r(T, D.props.children)),
                        (V.return = R),
                        (R = V));
                      break e;
                    }
                  } else if (
                    T.elementType === se ||
                    (typeof se == "object" &&
                      se !== null &&
                      se.$$typeof === Y &&
                      Ka(se) === T.type)
                  ) {
                    (n(R, T.sibling),
                      (V = r(T, D.props)),
                      ji(V, D),
                      (V.return = R),
                      (R = V));
                    break e;
                  }
                  n(R, T);
                  break;
                } else t(R, T);
                T = T.sibling;
              }
              D.type === E
                ? ((V = qa(D.props.children, R.mode, V, D.key)),
                  (V.return = R),
                  (R = V))
                : ((V = Cr(D.type, D.key, D.props, null, R.mode, V)),
                  ji(V, D),
                  (V.return = R),
                  (R = V));
            }
            return m(R);
          case A:
            e: {
              for (se = D.key; T !== null; ) {
                if (T.key === se)
                  if (
                    T.tag === 4 &&
                    T.stateNode.containerInfo === D.containerInfo &&
                    T.stateNode.implementation === D.implementation
                  ) {
                    (n(R, T.sibling),
                      (V = r(T, D.children || [])),
                      (V.return = R),
                      (R = V));
                    break e;
                  } else {
                    n(R, T);
                    break;
                  }
                else t(R, T);
                T = T.sibling;
              }
              ((V = Ao(D, R.mode, V)), (V.return = R), (R = V));
            }
            return m(R);
          case Y:
            return ((D = Ka(D)), ke(R, T, D, V));
        }
        if (je(D)) return ne(R, T, D, V);
        if (Ee(D)) {
          if (((se = Ee(D)), typeof se != "function")) throw Error(o(150));
          return ((D = se.call(D)), oe(R, T, D, V));
        }
        if (typeof D.then == "function") return ke(R, T, kr(D), V);
        if (D.$$typeof === L) return ke(R, T, zr(R, D), V);
        Ur(R, D);
      }
      return (typeof D == "string" && D !== "") ||
        typeof D == "number" ||
        typeof D == "bigint"
        ? ((D = "" + D),
          T !== null && T.tag === 6
            ? (n(R, T.sibling), (V = r(T, D)), (V.return = R), (R = V))
            : (n(R, T), (V = Co(D, R.mode, V)), (V.return = R), (R = V)),
          m(R))
        : n(R, T);
    }
    return function (R, T, D, V) {
      try {
        _i = 0;
        var se = ke(R, T, D, V);
        return ((Rl = null), se);
      } catch (re) {
        if (re === Al || re === Dr) throw re;
        var Ce = Vt(29, re, null, R.mode);
        return ((Ce.lanes = V), (Ce.return = R), Ce);
      }
    };
  }
  var $a = vd(!0),
    bd = vd(!1),
    oa = !1;
  function Yo(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function qo(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function ua(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function ca(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (((l = l.shared), (Re & 2) !== 0)) {
      var r = l.pending;
      return (
        r === null ? (t.next = t) : ((t.next = r.next), (r.next = t)),
        (l.pending = t),
        (t = Tr(e)),
        td(e, null, n),
        t
      );
    }
    return (jr(e, l, t, n), Tr(e));
  }
  function Ti(e, t, n) {
    if (
      ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194048) !== 0))
    ) {
      var l = t.lanes;
      ((l &= e.pendingLanes), (n |= l), (t.lanes = n), Rt(e, n));
    }
  }
  function Vo(e, t) {
    var n = e.updateQueue,
      l = e.alternate;
    if (l !== null && ((l = l.updateQueue), n === l)) {
      var r = null,
        u = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var m = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null,
          };
          (u === null ? (r = u = m) : (u = u.next = m), (n = n.next));
        } while (n !== null);
        u === null ? (r = u = t) : (u = u.next = t);
      } else r = u = t;
      ((n = {
        baseState: l.baseState,
        firstBaseUpdate: r,
        lastBaseUpdate: u,
        shared: l.shared,
        callbacks: l.callbacks,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  var Xo = !1;
  function Ci() {
    if (Xo) {
      var e = Cl;
      if (e !== null) throw e;
    }
  }
  function Ai(e, t, n, l) {
    Xo = !1;
    var r = e.updateQueue;
    oa = !1;
    var u = r.firstBaseUpdate,
      m = r.lastBaseUpdate,
      x = r.shared.pending;
    if (x !== null) {
      r.shared.pending = null;
      var w = x,
        O = w.next;
      ((w.next = null), m === null ? (u = O) : (m.next = O), (m = w));
      var G = e.alternate;
      G !== null &&
        ((G = G.updateQueue),
        (x = G.lastBaseUpdate),
        x !== m &&
          (x === null ? (G.firstBaseUpdate = O) : (x.next = O),
          (G.lastBaseUpdate = w)));
    }
    if (u !== null) {
      var Q = r.baseState;
      ((m = 0), (G = O = w = null), (x = u));
      do {
        var k = x.lane & -536870913,
          U = k !== x.lane;
        if (U ? (we & k) === k : (l & k) === k) {
          (k !== 0 && k === Tl && (Xo = !0),
            G !== null &&
              (G = G.next =
                {
                  lane: 0,
                  tag: x.tag,
                  payload: x.payload,
                  callback: null,
                  next: null,
                }));
          e: {
            var ne = e,
              oe = x;
            k = t;
            var ke = n;
            switch (oe.tag) {
              case 1:
                if (((ne = oe.payload), typeof ne == "function")) {
                  Q = ne.call(ke, Q, k);
                  break e;
                }
                Q = ne;
                break e;
              case 3:
                ne.flags = (ne.flags & -65537) | 128;
              case 0:
                if (
                  ((ne = oe.payload),
                  (k = typeof ne == "function" ? ne.call(ke, Q, k) : ne),
                  k == null)
                )
                  break e;
                Q = p({}, Q, k);
                break e;
              case 2:
                oa = !0;
            }
          }
          ((k = x.callback),
            k !== null &&
              ((e.flags |= 64),
              U && (e.flags |= 8192),
              (U = r.callbacks),
              U === null ? (r.callbacks = [k]) : U.push(k)));
        } else
          ((U = {
            lane: k,
            tag: x.tag,
            payload: x.payload,
            callback: x.callback,
            next: null,
          }),
            G === null ? ((O = G = U), (w = Q)) : (G = G.next = U),
            (m |= k));
        if (((x = x.next), x === null)) {
          if (((x = r.shared.pending), x === null)) break;
          ((U = x),
            (x = U.next),
            (U.next = null),
            (r.lastBaseUpdate = U),
            (r.shared.pending = null));
        }
      } while (!0);
      (G === null && (w = Q),
        (r.baseState = w),
        (r.firstBaseUpdate = O),
        (r.lastBaseUpdate = G),
        u === null && (r.shared.lanes = 0),
        (ga |= m),
        (e.lanes = m),
        (e.memoizedState = Q));
    }
  }
  function yd(e, t) {
    if (typeof e != "function") throw Error(o(191, e));
    e.call(t);
  }
  function xd(e, t) {
    var n = e.callbacks;
    if (n !== null)
      for (e.callbacks = null, e = 0; e < n.length; e++) yd(n[e], t);
  }
  var zl = j(null),
    Lr = j(0);
  function Sd(e, t) {
    ((e = Yn), Z(Lr, e), Z(zl, t), (Yn = e | t.baseLanes));
  }
  function Qo() {
    (Z(Lr, Yn), Z(zl, zl.current));
  }
  function Zo() {
    ((Yn = Lr.current), q(zl), q(Lr));
  }
  var Xt = j(null),
    an = null;
  function fa(e) {
    var t = e.alternate;
    (Z(Je, Je.current & 1),
      Z(Xt, e),
      an === null &&
        (t === null || zl.current !== null || t.memoizedState !== null) &&
        (an = e));
  }
  function Ko(e) {
    (Z(Je, Je.current), Z(Xt, e), an === null && (an = e));
  }
  function Ed(e) {
    e.tag === 22
      ? (Z(Je, Je.current), Z(Xt, e), an === null && (an = e))
      : da();
  }
  function da() {
    (Z(Je, Je.current), Z(Xt, Xt.current));
  }
  function Qt(e) {
    (q(Xt), an === e && (an = null), q(Je));
  }
  var Je = j(0);
  function Br(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || Pu(n) || ec(n)))
          return t;
      } else if (
        t.tag === 19 &&
        (t.memoizedProps.revealOrder === "forwards" ||
          t.memoizedProps.revealOrder === "backwards" ||
          t.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          t.memoizedProps.revealOrder === "together")
      ) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var Dn = 0,
    he = null,
    De = null,
    Pe = null,
    Hr = !1,
    Ml = !1,
    Fa = !1,
    Gr = 0,
    Ri = 0,
    Dl = null,
    ny = 0;
  function Ze() {
    throw Error(o(321));
  }
  function Jo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++)
      if (!qt(e[n], t[n])) return !1;
    return !0;
  }
  function $o(e, t, n, l, r, u) {
    return (
      (Dn = u),
      (he = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (M.H = e === null || e.memoizedState === null ? im : cu),
      (Fa = !1),
      (u = n(l, r)),
      (Fa = !1),
      Ml && (u = Nd(t, n, l, r)),
      wd(e),
      u
    );
  }
  function wd(e) {
    M.H = Di;
    var t = De !== null && De.next !== null;
    if (((Dn = 0), (Pe = De = he = null), (Hr = !1), (Ri = 0), (Dl = null), t))
      throw Error(o(300));
    e === null ||
      et ||
      ((e = e.dependencies), e !== null && Rr(e) && (et = !0));
  }
  function Nd(e, t, n, l) {
    he = e;
    var r = 0;
    do {
      if ((Ml && (Dl = null), (Ri = 0), (Ml = !1), 25 <= r))
        throw Error(o(301));
      if (((r += 1), (Pe = De = null), e.updateQueue != null)) {
        var u = e.updateQueue;
        ((u.lastEffect = null),
          (u.events = null),
          (u.stores = null),
          u.memoCache != null && (u.memoCache.index = 0));
      }
      ((M.H = rm), (u = t(n, l)));
    } while (Ml);
    return u;
  }
  function ay() {
    var e = M.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == "function" ? zi(t) : t),
      (e = e.useState()[0]),
      (De !== null ? De.memoizedState : null) !== e && (he.flags |= 1024),
      t
    );
  }
  function Fo() {
    var e = Gr !== 0;
    return ((Gr = 0), e);
  }
  function Wo(e, t, n) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
  }
  function Io(e) {
    if (Hr) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      Hr = !1;
    }
    ((Dn = 0), (Pe = De = he = null), (Ml = !1), (Ri = Gr = 0), (Dl = null));
  }
  function Tt() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return (Pe === null ? (he.memoizedState = Pe = e) : (Pe = Pe.next = e), Pe);
  }
  function $e() {
    if (De === null) {
      var e = he.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = De.next;
    var t = Pe === null ? he.memoizedState : Pe.next;
    if (t !== null) ((Pe = t), (De = e));
    else {
      if (e === null)
        throw he.alternate === null ? Error(o(467)) : Error(o(310));
      ((De = e),
        (e = {
          memoizedState: De.memoizedState,
          baseState: De.baseState,
          baseQueue: De.baseQueue,
          queue: De.queue,
          next: null,
        }),
        Pe === null ? (he.memoizedState = Pe = e) : (Pe = Pe.next = e));
    }
    return Pe;
  }
  function Yr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function zi(e) {
    var t = Ri;
    return (
      (Ri += 1),
      Dl === null && (Dl = []),
      (e = hd(Dl, e, t)),
      (t = he),
      (Pe === null ? t.memoizedState : Pe.next) === null &&
        ((t = t.alternate),
        (M.H = t === null || t.memoizedState === null ? im : cu)),
      e
    );
  }
  function qr(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return zi(e);
      if (e.$$typeof === L) return dt(e);
    }
    throw Error(o(438, String(e)));
  }
  function Po(e) {
    var t = null,
      n = he.updateQueue;
    if ((n !== null && (t = n.memoCache), t == null)) {
      var l = he.alternate;
      l !== null &&
        ((l = l.updateQueue),
        l !== null &&
          ((l = l.memoCache),
          l != null &&
            (t = {
              data: l.data.map(function (r) {
                return r.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      n === null && ((n = Yr()), (he.updateQueue = n)),
      (n.memoCache = t),
      (n = t.data[t.index]),
      n === void 0)
    )
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++) n[l] = ye;
    return (t.index++, n);
  }
  function On(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Vr(e) {
    var t = $e();
    return eu(t, De, e);
  }
  function eu(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(o(311));
    l.lastRenderedReducer = n;
    var r = e.baseQueue,
      u = l.pending;
    if (u !== null) {
      if (r !== null) {
        var m = r.next;
        ((r.next = u.next), (u.next = m));
      }
      ((t.baseQueue = r = u), (l.pending = null));
    }
    if (((u = e.baseState), r === null)) e.memoizedState = u;
    else {
      t = r.next;
      var x = (m = null),
        w = null,
        O = t,
        G = !1;
      do {
        var Q = O.lane & -536870913;
        if (Q !== O.lane ? (we & Q) === Q : (Dn & Q) === Q) {
          var k = O.revertLane;
          if (k === 0)
            (w !== null &&
              (w = w.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: O.action,
                  hasEagerState: O.hasEagerState,
                  eagerState: O.eagerState,
                  next: null,
                }),
              Q === Tl && (G = !0));
          else if ((Dn & k) === k) {
            ((O = O.next), k === Tl && (G = !0));
            continue;
          } else
            ((Q = {
              lane: 0,
              revertLane: O.revertLane,
              gesture: null,
              action: O.action,
              hasEagerState: O.hasEagerState,
              eagerState: O.eagerState,
              next: null,
            }),
              w === null ? ((x = w = Q), (m = u)) : (w = w.next = Q),
              (he.lanes |= k),
              (ga |= k));
          ((Q = O.action),
            Fa && n(u, Q),
            (u = O.hasEagerState ? O.eagerState : n(u, Q)));
        } else
          ((k = {
            lane: Q,
            revertLane: O.revertLane,
            gesture: O.gesture,
            action: O.action,
            hasEagerState: O.hasEagerState,
            eagerState: O.eagerState,
            next: null,
          }),
            w === null ? ((x = w = k), (m = u)) : (w = w.next = k),
            (he.lanes |= Q),
            (ga |= Q));
        O = O.next;
      } while (O !== null && O !== t);
      if (
        (w === null ? (m = u) : (w.next = x),
        !qt(u, e.memoizedState) && ((et = !0), G && ((n = Cl), n !== null)))
      )
        throw n;
      ((e.memoizedState = u),
        (e.baseState = m),
        (e.baseQueue = w),
        (l.lastRenderedState = u));
    }
    return (r === null && (l.lanes = 0), [e.memoizedState, l.dispatch]);
  }
  function tu(e) {
    var t = $e(),
      n = t.queue;
    if (n === null) throw Error(o(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch,
      r = n.pending,
      u = t.memoizedState;
    if (r !== null) {
      n.pending = null;
      var m = (r = r.next);
      do ((u = e(u, m.action)), (m = m.next));
      while (m !== r);
      (qt(u, t.memoizedState) || (et = !0),
        (t.memoizedState = u),
        t.baseQueue === null && (t.baseState = u),
        (n.lastRenderedState = u));
    }
    return [u, l];
  }
  function _d(e, t, n) {
    var l = he,
      r = $e(),
      u = Te;
    if (u) {
      if (n === void 0) throw Error(o(407));
      n = n();
    } else n = t();
    var m = !qt((De || r).memoizedState, n);
    if (
      (m && ((r.memoizedState = n), (et = !0)),
      (r = r.queue),
      lu(Cd.bind(null, l, r, e), [e]),
      r.getSnapshot !== t || m || (Pe !== null && Pe.memoizedState.tag & 1))
    ) {
      if (
        ((l.flags |= 2048),
        Ol(9, { destroy: void 0 }, Td.bind(null, l, r, n, t), null),
        Ue === null)
      )
        throw Error(o(349));
      u || (Dn & 127) !== 0 || jd(l, t, n);
    }
    return n;
  }
  function jd(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = he.updateQueue),
      t === null
        ? ((t = Yr()), (he.updateQueue = t), (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function Td(e, t, n, l) {
    ((t.value = n), (t.getSnapshot = l), Ad(t) && Rd(e));
  }
  function Cd(e, t, n) {
    return n(function () {
      Ad(t) && Rd(e);
    });
  }
  function Ad(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !qt(e, n);
    } catch {
      return !0;
    }
  }
  function Rd(e) {
    var t = Ya(e, 2);
    t !== null && Bt(t, e, 2);
  }
  function nu(e) {
    var t = Tt();
    if (typeof e == "function") {
      var n = e;
      if (((e = n()), Fa)) {
        on(!0);
        try {
          n();
        } finally {
          on(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: On,
        lastRenderedState: e,
      }),
      t
    );
  }
  function zd(e, t, n, l) {
    return ((e.baseState = n), eu(e, De, typeof l == "function" ? l : On));
  }
  function ly(e, t, n, l, r) {
    if (Zr(e)) throw Error(o(485));
    if (((e = t.action), e !== null)) {
      var u = {
        payload: r,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (m) {
          u.listeners.push(m);
        },
      };
      (M.T !== null ? n(!0) : (u.isTransition = !1),
        l(u),
        (n = t.pending),
        n === null
          ? ((u.next = t.pending = u), Md(t, u))
          : ((u.next = n.next), (t.pending = n.next = u)));
    }
  }
  function Md(e, t) {
    var n = t.action,
      l = t.payload,
      r = e.state;
    if (t.isTransition) {
      var u = M.T,
        m = {};
      M.T = m;
      try {
        var x = n(r, l),
          w = M.S;
        (w !== null && w(m, x), Dd(e, t, x));
      } catch (O) {
        au(e, t, O);
      } finally {
        (u !== null && m.types !== null && (u.types = m.types), (M.T = u));
      }
    } else
      try {
        ((u = n(r, l)), Dd(e, t, u));
      } catch (O) {
        au(e, t, O);
      }
  }
  function Dd(e, t, n) {
    n !== null && typeof n == "object" && typeof n.then == "function"
      ? n.then(
          function (l) {
            Od(e, t, l);
          },
          function (l) {
            return au(e, t, l);
          },
        )
      : Od(e, t, n);
  }
  function Od(e, t, n) {
    ((t.status = "fulfilled"),
      (t.value = n),
      kd(t),
      (e.state = n),
      (t = e.pending),
      t !== null &&
        ((n = t.next),
        n === t ? (e.pending = null) : ((n = n.next), (t.next = n), Md(e, n))));
  }
  function au(e, t, n) {
    var l = e.pending;
    if (((e.pending = null), l !== null)) {
      l = l.next;
      do ((t.status = "rejected"), (t.reason = n), kd(t), (t = t.next));
      while (t !== l);
    }
    e.action = null;
  }
  function kd(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function Ud(e, t) {
    return t;
  }
  function Ld(e, t) {
    if (Te) {
      var n = Ue.formState;
      if (n !== null) {
        e: {
          var l = he;
          if (Te) {
            if (Be) {
              t: {
                for (var r = Be, u = nn; r.nodeType !== 8; ) {
                  if (!u) {
                    r = null;
                    break t;
                  }
                  if (((r = ln(r.nextSibling)), r === null)) {
                    r = null;
                    break t;
                  }
                }
                ((u = r.data), (r = u === "F!" || u === "F" ? r : null));
              }
              if (r) {
                ((Be = ln(r.nextSibling)), (l = r.data === "F!"));
                break e;
              }
            }
            ra(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return (
      (n = Tt()),
      (n.memoizedState = n.baseState = t),
      (l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ud,
        lastRenderedState: t,
      }),
      (n.queue = l),
      (n = nm.bind(null, he, l)),
      (l.dispatch = n),
      (l = nu(!1)),
      (u = uu.bind(null, he, !1, l.queue)),
      (l = Tt()),
      (r = { state: t, dispatch: null, action: e, pending: null }),
      (l.queue = r),
      (n = ly.bind(null, he, r, u, n)),
      (r.dispatch = n),
      (l.memoizedState = e),
      [t, n, !1]
    );
  }
  function Bd(e) {
    var t = $e();
    return Hd(t, De, e);
  }
  function Hd(e, t, n) {
    if (
      ((t = eu(e, t, Ud)[0]),
      (e = Vr(On)[0]),
      typeof t == "object" && t !== null && typeof t.then == "function")
    )
      try {
        var l = zi(t);
      } catch (m) {
        throw m === Al ? Dr : m;
      }
    else l = t;
    t = $e();
    var r = t.queue,
      u = r.dispatch;
    return (
      n !== t.memoizedState &&
        ((he.flags |= 2048),
        Ol(9, { destroy: void 0 }, iy.bind(null, r, n), null)),
      [l, u, e]
    );
  }
  function iy(e, t) {
    e.action = t;
  }
  function Gd(e) {
    var t = $e(),
      n = De;
    if (n !== null) return Hd(t, n, e);
    ($e(), (t = t.memoizedState), (n = $e()));
    var l = n.queue.dispatch;
    return ((n.memoizedState = e), [t, l, !1]);
  }
  function Ol(e, t, n, l) {
    return (
      (e = { tag: e, create: n, deps: l, inst: t, next: null }),
      (t = he.updateQueue),
      t === null && ((t = Yr()), (he.updateQueue = t)),
      (n = t.lastEffect),
      n === null
        ? (t.lastEffect = e.next = e)
        : ((l = n.next), (n.next = e), (e.next = l), (t.lastEffect = e)),
      e
    );
  }
  function Yd() {
    return $e().memoizedState;
  }
  function Xr(e, t, n, l) {
    var r = Tt();
    ((he.flags |= e),
      (r.memoizedState = Ol(
        1 | t,
        { destroy: void 0 },
        n,
        l === void 0 ? null : l,
      )));
  }
  function Qr(e, t, n, l) {
    var r = $e();
    l = l === void 0 ? null : l;
    var u = r.memoizedState.inst;
    De !== null && l !== null && Jo(l, De.memoizedState.deps)
      ? (r.memoizedState = Ol(t, u, n, l))
      : ((he.flags |= e), (r.memoizedState = Ol(1 | t, u, n, l)));
  }
  function qd(e, t) {
    Xr(8390656, 8, e, t);
  }
  function lu(e, t) {
    Qr(2048, 8, e, t);
  }
  function ry(e) {
    he.flags |= 4;
    var t = he.updateQueue;
    if (t === null) ((t = Yr()), (he.updateQueue = t), (t.events = [e]));
    else {
      var n = t.events;
      n === null ? (t.events = [e]) : n.push(e);
    }
  }
  function Vd(e) {
    var t = $e().memoizedState;
    return (
      ry({ ref: t, nextImpl: e }),
      function () {
        if ((Re & 2) !== 0) throw Error(o(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function Xd(e, t) {
    return Qr(4, 2, e, t);
  }
  function Qd(e, t) {
    return Qr(4, 4, e, t);
  }
  function Zd(e, t) {
    if (typeof t == "function") {
      e = e();
      var n = t(e);
      return function () {
        typeof n == "function" ? n() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function Kd(e, t, n) {
    ((n = n != null ? n.concat([e]) : null), Qr(4, 4, Zd.bind(null, t, e), n));
  }
  function iu() {}
  function Jd(e, t) {
    var n = $e();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && Jo(t, l[1]) ? l[0] : ((n.memoizedState = [e, t]), e);
  }
  function $d(e, t) {
    var n = $e();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && Jo(t, l[1])) return l[0];
    if (((l = e()), Fa)) {
      on(!0);
      try {
        e();
      } finally {
        on(!1);
      }
    }
    return ((n.memoizedState = [l, t]), l);
  }
  function ru(e, t, n) {
    return n === void 0 || ((Dn & 1073741824) !== 0 && (we & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = n), (e = Fm()), (he.lanes |= e), (ga |= e), n);
  }
  function Fd(e, t, n, l) {
    return qt(n, t)
      ? n
      : zl.current !== null
        ? ((e = ru(e, n, l)), qt(e, t) || (et = !0), e)
        : (Dn & 42) === 0 || ((Dn & 1073741824) !== 0 && (we & 261930) === 0)
          ? ((et = !0), (e.memoizedState = n))
          : ((e = Fm()), (he.lanes |= e), (ga |= e), t);
  }
  function Wd(e, t, n, l, r) {
    var u = K.p;
    K.p = u !== 0 && 8 > u ? u : 8;
    var m = M.T,
      x = {};
    ((M.T = x), uu(e, !1, t, n));
    try {
      var w = r(),
        O = M.S;
      if (
        (O !== null && O(x, w),
        w !== null && typeof w == "object" && typeof w.then == "function")
      ) {
        var G = ty(w, l);
        Mi(e, t, G, Jt(e));
      } else Mi(e, t, l, Jt(e));
    } catch (Q) {
      Mi(e, t, { then: function () {}, status: "rejected", reason: Q }, Jt());
    } finally {
      ((K.p = u),
        m !== null && x.types !== null && (m.types = x.types),
        (M.T = m));
    }
  }
  function sy() {}
  function su(e, t, n, l) {
    if (e.tag !== 5) throw Error(o(476));
    var r = Id(e).queue;
    Wd(
      e,
      r,
      t,
      ie,
      n === null
        ? sy
        : function () {
            return (Pd(e), n(l));
          },
    );
  }
  function Id(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: ie,
      baseState: ie,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: On,
        lastRenderedState: ie,
      },
      next: null,
    };
    var n = {};
    return (
      (t.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: On,
          lastRenderedState: n,
        },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function Pd(e) {
    var t = Id(e);
    (t.next === null && (t = e.alternate.memoizedState),
      Mi(e, t.next.queue, {}, Jt()));
  }
  function ou() {
    return dt($i);
  }
  function em() {
    return $e().memoizedState;
  }
  function tm() {
    return $e().memoizedState;
  }
  function oy(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = Jt();
          e = ua(n);
          var l = ca(t, e, n);
          (l !== null && (Bt(l, t, n), Ti(l, t, n)),
            (t = { cache: Lo() }),
            (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function uy(e, t, n) {
    var l = Jt();
    ((n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Zr(e)
        ? am(t, n)
        : ((n = jo(e, t, n, l)), n !== null && (Bt(n, e, l), lm(n, t, l))));
  }
  function nm(e, t, n) {
    var l = Jt();
    Mi(e, t, n, l);
  }
  function Mi(e, t, n, l) {
    var r = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Zr(e)) am(t, r);
    else {
      var u = e.alternate;
      if (
        e.lanes === 0 &&
        (u === null || u.lanes === 0) &&
        ((u = t.lastRenderedReducer), u !== null)
      )
        try {
          var m = t.lastRenderedState,
            x = u(m, n);
          if (((r.hasEagerState = !0), (r.eagerState = x), qt(x, m)))
            return (jr(e, t, r, 0), Ue === null && _r(), !1);
        } catch {}
      if (((n = jo(e, t, r, l)), n !== null))
        return (Bt(n, e, l), lm(n, t, l), !0);
    }
    return !1;
  }
  function uu(e, t, n, l) {
    if (
      ((l = {
        lane: 2,
        revertLane: Yu(),
        gesture: null,
        action: l,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Zr(e))
    ) {
      if (t) throw Error(o(479));
    } else ((t = jo(e, n, l, 2)), t !== null && Bt(t, e, 2));
  }
  function Zr(e) {
    var t = e.alternate;
    return e === he || (t !== null && t === he);
  }
  function am(e, t) {
    Ml = Hr = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
      (e.pending = t));
  }
  function lm(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      ((l &= e.pendingLanes), (n |= l), (t.lanes = n), Rt(e, n));
    }
  }
  var Di = {
    readContext: dt,
    use: qr,
    useCallback: Ze,
    useContext: Ze,
    useEffect: Ze,
    useImperativeHandle: Ze,
    useLayoutEffect: Ze,
    useInsertionEffect: Ze,
    useMemo: Ze,
    useReducer: Ze,
    useRef: Ze,
    useState: Ze,
    useDebugValue: Ze,
    useDeferredValue: Ze,
    useTransition: Ze,
    useSyncExternalStore: Ze,
    useId: Ze,
    useHostTransitionStatus: Ze,
    useFormState: Ze,
    useActionState: Ze,
    useOptimistic: Ze,
    useMemoCache: Ze,
    useCacheRefresh: Ze,
  };
  Di.useEffectEvent = Ze;
  var im = {
      readContext: dt,
      use: qr,
      useCallback: function (e, t) {
        return ((Tt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: dt,
      useEffect: qd,
      useImperativeHandle: function (e, t, n) {
        ((n = n != null ? n.concat([e]) : null),
          Xr(4194308, 4, Zd.bind(null, t, e), n));
      },
      useLayoutEffect: function (e, t) {
        return Xr(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        Xr(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = Tt();
        t = t === void 0 ? null : t;
        var l = e();
        if (Fa) {
          on(!0);
          try {
            e();
          } finally {
            on(!1);
          }
        }
        return ((n.memoizedState = [l, t]), l);
      },
      useReducer: function (e, t, n) {
        var l = Tt();
        if (n !== void 0) {
          var r = n(t);
          if (Fa) {
            on(!0);
            try {
              n(t);
            } finally {
              on(!1);
            }
          }
        } else r = t;
        return (
          (l.memoizedState = l.baseState = r),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: r,
          }),
          (l.queue = e),
          (e = e.dispatch = uy.bind(null, he, e)),
          [l.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = Tt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = nu(e);
        var t = e.queue,
          n = nm.bind(null, he, t);
        return ((t.dispatch = n), [e.memoizedState, n]);
      },
      useDebugValue: iu,
      useDeferredValue: function (e, t) {
        var n = Tt();
        return ru(n, e, t);
      },
      useTransition: function () {
        var e = nu(!1);
        return (
          (e = Wd.bind(null, he, e.queue, !0, !1)),
          (Tt().memoizedState = e),
          [!1, e]
        );
      },
      useSyncExternalStore: function (e, t, n) {
        var l = he,
          r = Tt();
        if (Te) {
          if (n === void 0) throw Error(o(407));
          n = n();
        } else {
          if (((n = t()), Ue === null)) throw Error(o(349));
          (we & 127) !== 0 || jd(l, t, n);
        }
        r.memoizedState = n;
        var u = { value: n, getSnapshot: t };
        return (
          (r.queue = u),
          qd(Cd.bind(null, l, u, e), [e]),
          (l.flags |= 2048),
          Ol(9, { destroy: void 0 }, Td.bind(null, l, u, n, t), null),
          n
        );
      },
      useId: function () {
        var e = Tt(),
          t = Ue.identifierPrefix;
        if (Te) {
          var n = vn,
            l = pn;
          ((n = (l & ~(1 << (32 - yt(l) - 1))).toString(32) + n),
            (t = "_" + t + "R_" + n),
            (n = Gr++),
            0 < n && (t += "H" + n.toString(32)),
            (t += "_"));
        } else ((n = ny++), (t = "_" + t + "r_" + n.toString(32) + "_"));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: ou,
      useFormState: Ld,
      useActionState: Ld,
      useOptimistic: function (e) {
        var t = Tt();
        t.memoizedState = t.baseState = e;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (t.queue = n),
          (t = uu.bind(null, he, !0, n)),
          (n.dispatch = t),
          [e, t]
        );
      },
      useMemoCache: Po,
      useCacheRefresh: function () {
        return (Tt().memoizedState = oy.bind(null, he));
      },
      useEffectEvent: function (e) {
        var t = Tt(),
          n = { impl: e };
        return (
          (t.memoizedState = n),
          function () {
            if ((Re & 2) !== 0) throw Error(o(440));
            return n.impl.apply(void 0, arguments);
          }
        );
      },
    },
    cu = {
      readContext: dt,
      use: qr,
      useCallback: Jd,
      useContext: dt,
      useEffect: lu,
      useImperativeHandle: Kd,
      useInsertionEffect: Xd,
      useLayoutEffect: Qd,
      useMemo: $d,
      useReducer: Vr,
      useRef: Yd,
      useState: function () {
        return Vr(On);
      },
      useDebugValue: iu,
      useDeferredValue: function (e, t) {
        var n = $e();
        return Fd(n, De.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Vr(On)[0],
          t = $e().memoizedState;
        return [typeof e == "boolean" ? e : zi(e), t];
      },
      useSyncExternalStore: _d,
      useId: em,
      useHostTransitionStatus: ou,
      useFormState: Bd,
      useActionState: Bd,
      useOptimistic: function (e, t) {
        var n = $e();
        return zd(n, De, e, t);
      },
      useMemoCache: Po,
      useCacheRefresh: tm,
    };
  cu.useEffectEvent = Vd;
  var rm = {
    readContext: dt,
    use: qr,
    useCallback: Jd,
    useContext: dt,
    useEffect: lu,
    useImperativeHandle: Kd,
    useInsertionEffect: Xd,
    useLayoutEffect: Qd,
    useMemo: $d,
    useReducer: tu,
    useRef: Yd,
    useState: function () {
      return tu(On);
    },
    useDebugValue: iu,
    useDeferredValue: function (e, t) {
      var n = $e();
      return De === null ? ru(n, e, t) : Fd(n, De.memoizedState, e, t);
    },
    useTransition: function () {
      var e = tu(On)[0],
        t = $e().memoizedState;
      return [typeof e == "boolean" ? e : zi(e), t];
    },
    useSyncExternalStore: _d,
    useId: em,
    useHostTransitionStatus: ou,
    useFormState: Gd,
    useActionState: Gd,
    useOptimistic: function (e, t) {
      var n = $e();
      return De !== null
        ? zd(n, De, e, t)
        : ((n.baseState = e), [e, n.queue.dispatch]);
    },
    useMemoCache: Po,
    useCacheRefresh: tm,
  };
  rm.useEffectEvent = Vd;
  function fu(e, t, n, l) {
    ((t = e.memoizedState),
      (n = n(l, t)),
      (n = n == null ? t : p({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var du = {
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var l = Jt(),
        r = ua(l);
      ((r.payload = t),
        n != null && (r.callback = n),
        (t = ca(e, r, l)),
        t !== null && (Bt(t, e, l), Ti(t, e, l)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var l = Jt(),
        r = ua(l);
      ((r.tag = 1),
        (r.payload = t),
        n != null && (r.callback = n),
        (t = ca(e, r, l)),
        t !== null && (Bt(t, e, l), Ti(t, e, l)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = Jt(),
        l = ua(n);
      ((l.tag = 2),
        t != null && (l.callback = t),
        (t = ca(e, l, n)),
        t !== null && (Bt(t, e, n), Ti(t, e, n)));
    },
  };
  function sm(e, t, n, l, r, u, m) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == "function"
        ? e.shouldComponentUpdate(l, u, m)
        : t.prototype && t.prototype.isPureReactComponent
          ? !yi(n, l) || !yi(r, u)
          : !0
    );
  }
  function om(e, t, n, l) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == "function" &&
        t.componentWillReceiveProps(n, l),
      typeof t.UNSAFE_componentWillReceiveProps == "function" &&
        t.UNSAFE_componentWillReceiveProps(n, l),
      t.state !== e && du.enqueueReplaceState(t, t.state, null));
  }
  function Wa(e, t) {
    var n = t;
    if ("ref" in t) {
      n = {};
      for (var l in t) l !== "ref" && (n[l] = t[l]);
    }
    if ((e = e.defaultProps)) {
      n === t && (n = p({}, n));
      for (var r in e) n[r] === void 0 && (n[r] = e[r]);
    }
    return n;
  }
  function um(e) {
    Nr(e);
  }
  function cm(e) {
    console.error(e);
  }
  function fm(e) {
    Nr(e);
  }
  function Kr(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function () {
        throw l;
      });
    }
  }
  function dm(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, {
        componentStack: n.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null,
      });
    } catch (r) {
      setTimeout(function () {
        throw r;
      });
    }
  }
  function mu(e, t, n) {
    return (
      (n = ua(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        Kr(e, t);
      }),
      n
    );
  }
  function mm(e) {
    return ((e = ua(e)), (e.tag = 3), e);
  }
  function hm(e, t, n, l) {
    var r = n.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var u = l.value;
      ((e.payload = function () {
        return r(u);
      }),
        (e.callback = function () {
          dm(t, n, l);
        }));
    }
    var m = n.stateNode;
    m !== null &&
      typeof m.componentDidCatch == "function" &&
      (e.callback = function () {
        (dm(t, n, l),
          typeof r != "function" &&
            (pa === null ? (pa = new Set([this])) : pa.add(this)));
        var x = l.stack;
        this.componentDidCatch(l.value, {
          componentStack: x !== null ? x : "",
        });
      });
  }
  function cy(e, t, n, l, r) {
    if (
      ((n.flags |= 32768),
      l !== null && typeof l == "object" && typeof l.then == "function")
    ) {
      if (
        ((t = n.alternate),
        t !== null && jl(t, n, r, !0),
        (n = Xt.current),
        n !== null)
      ) {
        switch (n.tag) {
          case 31:
          case 13:
            return (
              an === null ? is() : n.alternate === null && Ke === 0 && (Ke = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = r),
              l === Or
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null ? (n.updateQueue = new Set([l])) : t.add(l),
                  Bu(e, l, r)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              l === Or
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null
                    ? ((t = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([l]),
                      }),
                      (n.updateQueue = t))
                    : ((n = t.retryQueue),
                      n === null ? (t.retryQueue = new Set([l])) : n.add(l)),
                  Bu(e, l, r)),
              !1
            );
        }
        throw Error(o(435, n.tag));
      }
      return (Bu(e, l, r), is(), !1);
    }
    if (Te)
      return (
        (t = Xt.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = r),
            l !== Mo && ((e = Error(o(422), { cause: l })), Ei(Pt(e, n))))
          : (l !== Mo && ((t = Error(o(423), { cause: l })), Ei(Pt(t, n))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (r &= -r),
            (e.lanes |= r),
            (l = Pt(l, n)),
            (r = mu(e.stateNode, l, r)),
            Vo(e, r),
            Ke !== 4 && (Ke = 2)),
        !1
      );
    var u = Error(o(520), { cause: l });
    if (
      ((u = Pt(u, n)),
      Yi === null ? (Yi = [u]) : Yi.push(u),
      Ke !== 4 && (Ke = 2),
      t === null)
    )
      return !0;
    ((l = Pt(l, n)), (n = t));
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (e = r & -r),
            (n.lanes |= e),
            (e = mu(n.stateNode, l, e)),
            Vo(n, e),
            !1
          );
        case 1:
          if (
            ((t = n.type),
            (u = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == "function" ||
                (u !== null &&
                  typeof u.componentDidCatch == "function" &&
                  (pa === null || !pa.has(u)))))
          )
            return (
              (n.flags |= 65536),
              (r &= -r),
              (n.lanes |= r),
              (r = mm(r)),
              hm(r, e, n, l),
              Vo(n, r),
              !1
            );
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var hu = Error(o(461)),
    et = !1;
  function mt(e, t, n, l) {
    t.child = e === null ? bd(t, null, n, l) : $a(t, e.child, n, l);
  }
  function gm(e, t, n, l, r) {
    n = n.render;
    var u = t.ref;
    if ("ref" in l) {
      var m = {};
      for (var x in l) x !== "ref" && (m[x] = l[x]);
    } else m = l;
    return (
      Qa(t),
      (l = $o(e, t, n, m, u, r)),
      (x = Fo()),
      e !== null && !et
        ? (Wo(e, t, r), kn(e, t, r))
        : (Te && x && Ro(t), (t.flags |= 1), mt(e, t, l, r), t.child)
    );
  }
  function pm(e, t, n, l, r) {
    if (e === null) {
      var u = n.type;
      return typeof u == "function" &&
        !To(u) &&
        u.defaultProps === void 0 &&
        n.compare === null
        ? ((t.tag = 15), (t.type = u), vm(e, t, u, l, r))
        : ((e = Cr(n.type, null, l, t, t.mode, r)),
          (e.ref = t.ref),
          (e.return = t),
          (t.child = e));
    }
    if (((u = e.child), !Eu(e, r))) {
      var m = u.memoizedProps;
      if (
        ((n = n.compare), (n = n !== null ? n : yi), n(m, l) && e.ref === t.ref)
      )
        return kn(e, t, r);
    }
    return (
      (t.flags |= 1),
      (e = An(u, l)),
      (e.ref = t.ref),
      (e.return = t),
      (t.child = e)
    );
  }
  function vm(e, t, n, l, r) {
    if (e !== null) {
      var u = e.memoizedProps;
      if (yi(u, l) && e.ref === t.ref)
        if (((et = !1), (t.pendingProps = l = u), Eu(e, r)))
          (e.flags & 131072) !== 0 && (et = !0);
        else return ((t.lanes = e.lanes), kn(e, t, r));
    }
    return gu(e, t, n, l, r);
  }
  function bm(e, t, n, l) {
    var r = l.children,
      u = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      l.mode === "hidden")
    ) {
      if ((t.flags & 128) !== 0) {
        if (((u = u !== null ? u.baseLanes | n : n), e !== null)) {
          for (l = t.child = e.child, r = 0; l !== null; )
            ((r = r | l.lanes | l.childLanes), (l = l.sibling));
          l = r & ~u;
        } else ((l = 0), (t.child = null));
        return ym(e, t, u, n, l);
      }
      if ((n & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && Mr(t, u !== null ? u.cachePool : null),
          u !== null ? Sd(t, u) : Qo(),
          Ed(t));
      else
        return (
          (l = t.lanes = 536870912),
          ym(e, t, u !== null ? u.baseLanes | n : n, n, l)
        );
    } else
      u !== null
        ? (Mr(t, u.cachePool), Sd(t, u), da(), (t.memoizedState = null))
        : (e !== null && Mr(t, null), Qo(), da());
    return (mt(e, t, r, n), t.child);
  }
  function Oi(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function ym(e, t, n, l, r) {
    var u = Ho();
    return (
      (u = u === null ? null : { parent: Ie._currentValue, pool: u }),
      (t.memoizedState = { baseLanes: n, cachePool: u }),
      e !== null && Mr(t, null),
      Qo(),
      Ed(t),
      e !== null && jl(e, t, l, !0),
      (t.childLanes = r),
      null
    );
  }
  function Jr(e, t) {
    return (
      (t = Fr({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function xm(e, t, n) {
    return (
      $a(t, e.child, null, n),
      (e = Jr(t, t.pendingProps)),
      (e.flags |= 2),
      Qt(t),
      (t.memoizedState = null),
      e
    );
  }
  function fy(e, t, n) {
    var l = t.pendingProps,
      r = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (Te) {
        if (l.mode === "hidden")
          return ((e = Jr(t, l)), (t.lanes = 536870912), Oi(null, e));
        if (
          (Ko(t),
          (e = Be)
            ? ((e = Mh(e, nn)),
              (e = e !== null && e.data === "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: la !== null ? { id: pn, overflow: vn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = ad(e)),
                (n.return = t),
                (t.child = n),
                (ft = t),
                (Be = null)))
            : (e = null),
          e === null)
        )
          throw ra(t);
        return ((t.lanes = 536870912), null);
      }
      return Jr(t, l);
    }
    var u = e.memoizedState;
    if (u !== null) {
      var m = u.dehydrated;
      if ((Ko(t), r))
        if (t.flags & 256) ((t.flags &= -257), (t = xm(e, t, n)));
        else if (t.memoizedState !== null)
          ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(o(558));
      else if (
        (et || jl(e, t, n, !1), (r = (n & e.childLanes) !== 0), et || r)
      ) {
        if (
          ((l = Ue),
          l !== null && ((m = zt(l, n)), m !== 0 && m !== u.retryLane))
        )
          throw ((u.retryLane = m), Ya(e, m), Bt(l, e, m), hu);
        (is(), (t = xm(e, t, n)));
      } else
        ((e = u.treeContext),
          (Be = ln(m.nextSibling)),
          (ft = t),
          (Te = !0),
          (ia = null),
          (nn = !1),
          e !== null && rd(t, e),
          (t = Jr(t, l)),
          (t.flags |= 4096));
      return t;
    }
    return (
      (e = An(e.child, { mode: l.mode, children: l.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function $r(e, t) {
    var n = t.ref;
    if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(o(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function gu(e, t, n, l, r) {
    return (
      Qa(t),
      (n = $o(e, t, n, l, void 0, r)),
      (l = Fo()),
      e !== null && !et
        ? (Wo(e, t, r), kn(e, t, r))
        : (Te && l && Ro(t), (t.flags |= 1), mt(e, t, n, r), t.child)
    );
  }
  function Sm(e, t, n, l, r, u) {
    return (
      Qa(t),
      (t.updateQueue = null),
      (n = Nd(t, l, n, r)),
      wd(e),
      (l = Fo()),
      e !== null && !et
        ? (Wo(e, t, u), kn(e, t, u))
        : (Te && l && Ro(t), (t.flags |= 1), mt(e, t, n, u), t.child)
    );
  }
  function Em(e, t, n, l, r) {
    if ((Qa(t), t.stateNode === null)) {
      var u = El,
        m = n.contextType;
      (typeof m == "object" && m !== null && (u = dt(m)),
        (u = new n(l, u)),
        (t.memoizedState =
          u.state !== null && u.state !== void 0 ? u.state : null),
        (u.updater = du),
        (t.stateNode = u),
        (u._reactInternals = t),
        (u = t.stateNode),
        (u.props = l),
        (u.state = t.memoizedState),
        (u.refs = {}),
        Yo(t),
        (m = n.contextType),
        (u.context = typeof m == "object" && m !== null ? dt(m) : El),
        (u.state = t.memoizedState),
        (m = n.getDerivedStateFromProps),
        typeof m == "function" && (fu(t, n, m, l), (u.state = t.memoizedState)),
        typeof n.getDerivedStateFromProps == "function" ||
          typeof u.getSnapshotBeforeUpdate == "function" ||
          (typeof u.UNSAFE_componentWillMount != "function" &&
            typeof u.componentWillMount != "function") ||
          ((m = u.state),
          typeof u.componentWillMount == "function" && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == "function" &&
            u.UNSAFE_componentWillMount(),
          m !== u.state && du.enqueueReplaceState(u, u.state, null),
          Ai(t, l, u, r),
          Ci(),
          (u.state = t.memoizedState)),
        typeof u.componentDidMount == "function" && (t.flags |= 4194308),
        (l = !0));
    } else if (e === null) {
      u = t.stateNode;
      var x = t.memoizedProps,
        w = Wa(n, x);
      u.props = w;
      var O = u.context,
        G = n.contextType;
      ((m = El), typeof G == "object" && G !== null && (m = dt(G)));
      var Q = n.getDerivedStateFromProps;
      ((G =
        typeof Q == "function" ||
        typeof u.getSnapshotBeforeUpdate == "function"),
        (x = t.pendingProps !== x),
        G ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((x || O !== m) && om(t, u, l, m)),
        (oa = !1));
      var k = t.memoizedState;
      ((u.state = k),
        Ai(t, l, u, r),
        Ci(),
        (O = t.memoizedState),
        x || k !== O || oa
          ? (typeof Q == "function" && (fu(t, n, Q, l), (O = t.memoizedState)),
            (w = oa || sm(t, n, w, l, k, O, m))
              ? (G ||
                  (typeof u.UNSAFE_componentWillMount != "function" &&
                    typeof u.componentWillMount != "function") ||
                  (typeof u.componentWillMount == "function" &&
                    u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == "function" &&
                    u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == "function" &&
                  (t.flags |= 4194308))
              : (typeof u.componentDidMount == "function" &&
                  (t.flags |= 4194308),
                (t.memoizedProps = l),
                (t.memoizedState = O)),
            (u.props = l),
            (u.state = O),
            (u.context = m),
            (l = w))
          : (typeof u.componentDidMount == "function" && (t.flags |= 4194308),
            (l = !1)));
    } else {
      ((u = t.stateNode),
        qo(e, t),
        (m = t.memoizedProps),
        (G = Wa(n, m)),
        (u.props = G),
        (Q = t.pendingProps),
        (k = u.context),
        (O = n.contextType),
        (w = El),
        typeof O == "object" && O !== null && (w = dt(O)),
        (x = n.getDerivedStateFromProps),
        (O =
          typeof x == "function" ||
          typeof u.getSnapshotBeforeUpdate == "function") ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((m !== Q || k !== w) && om(t, u, l, w)),
        (oa = !1),
        (k = t.memoizedState),
        (u.state = k),
        Ai(t, l, u, r),
        Ci());
      var U = t.memoizedState;
      m !== Q ||
      k !== U ||
      oa ||
      (e !== null && e.dependencies !== null && Rr(e.dependencies))
        ? (typeof x == "function" && (fu(t, n, x, l), (U = t.memoizedState)),
          (G =
            oa ||
            sm(t, n, G, l, k, U, w) ||
            (e !== null && e.dependencies !== null && Rr(e.dependencies)))
            ? (O ||
                (typeof u.UNSAFE_componentWillUpdate != "function" &&
                  typeof u.componentWillUpdate != "function") ||
                (typeof u.componentWillUpdate == "function" &&
                  u.componentWillUpdate(l, U, w),
                typeof u.UNSAFE_componentWillUpdate == "function" &&
                  u.UNSAFE_componentWillUpdate(l, U, w)),
              typeof u.componentDidUpdate == "function" && (t.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == "function" &&
                (t.flags |= 1024))
            : (typeof u.componentDidUpdate != "function" ||
                (m === e.memoizedProps && k === e.memoizedState) ||
                (t.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != "function" ||
                (m === e.memoizedProps && k === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = l),
              (t.memoizedState = U)),
          (u.props = l),
          (u.state = U),
          (u.context = w),
          (l = G))
        : (typeof u.componentDidUpdate != "function" ||
            (m === e.memoizedProps && k === e.memoizedState) ||
            (t.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != "function" ||
            (m === e.memoizedProps && k === e.memoizedState) ||
            (t.flags |= 1024),
          (l = !1));
    }
    return (
      (u = l),
      $r(e, t),
      (l = (t.flags & 128) !== 0),
      u || l
        ? ((u = t.stateNode),
          (n =
            l && typeof n.getDerivedStateFromError != "function"
              ? null
              : u.render()),
          (t.flags |= 1),
          e !== null && l
            ? ((t.child = $a(t, e.child, null, r)),
              (t.child = $a(t, null, n, r)))
            : mt(e, t, n, r),
          (t.memoizedState = u.state),
          (e = t.child))
        : (e = kn(e, t, r)),
      e
    );
  }
  function wm(e, t, n, l) {
    return (Va(), (t.flags |= 256), mt(e, t, n, l), t.child);
  }
  var pu = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function vu(e) {
    return { baseLanes: e, cachePool: dd() };
  }
  function bu(e, t, n) {
    return ((e = e !== null ? e.childLanes & ~n : 0), t && (e |= Kt), e);
  }
  function Nm(e, t, n) {
    var l = t.pendingProps,
      r = !1,
      u = (t.flags & 128) !== 0,
      m;
    if (
      ((m = u) ||
        (m =
          e !== null && e.memoizedState === null ? !1 : (Je.current & 2) !== 0),
      m && ((r = !0), (t.flags &= -129)),
      (m = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (Te) {
        if (
          (r ? fa(t) : da(),
          (e = Be)
            ? ((e = Mh(e, nn)),
              (e = e !== null && e.data !== "&" ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: la !== null ? { id: pn, overflow: vn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = ad(e)),
                (n.return = t),
                (t.child = n),
                (ft = t),
                (Be = null)))
            : (e = null),
          e === null)
        )
          throw ra(t);
        return (ec(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      var x = l.children;
      return (
        (l = l.fallback),
        r
          ? (da(),
            (r = t.mode),
            (x = Fr({ mode: "hidden", children: x }, r)),
            (l = qa(l, r, n, null)),
            (x.return = t),
            (l.return = t),
            (x.sibling = l),
            (t.child = x),
            (l = t.child),
            (l.memoizedState = vu(n)),
            (l.childLanes = bu(e, m, n)),
            (t.memoizedState = pu),
            Oi(null, l))
          : (fa(t), yu(t, x))
      );
    }
    var w = e.memoizedState;
    if (w !== null && ((x = w.dehydrated), x !== null)) {
      if (u)
        t.flags & 256
          ? (fa(t), (t.flags &= -257), (t = xu(e, t, n)))
          : t.memoizedState !== null
            ? (da(), (t.child = e.child), (t.flags |= 128), (t = null))
            : (da(),
              (x = l.fallback),
              (r = t.mode),
              (l = Fr({ mode: "visible", children: l.children }, r)),
              (x = qa(x, r, n, null)),
              (x.flags |= 2),
              (l.return = t),
              (x.return = t),
              (l.sibling = x),
              (t.child = l),
              $a(t, e.child, null, n),
              (l = t.child),
              (l.memoizedState = vu(n)),
              (l.childLanes = bu(e, m, n)),
              (t.memoizedState = pu),
              (t = Oi(null, l)));
      else if ((fa(t), ec(x))) {
        if (((m = x.nextSibling && x.nextSibling.dataset), m)) var O = m.dgst;
        ((m = O),
          (l = Error(o(419))),
          (l.stack = ""),
          (l.digest = m),
          Ei({ value: l, source: null, stack: null }),
          (t = xu(e, t, n)));
      } else if (
        (et || jl(e, t, n, !1), (m = (n & e.childLanes) !== 0), et || m)
      ) {
        if (
          ((m = Ue),
          m !== null && ((l = zt(m, n)), l !== 0 && l !== w.retryLane))
        )
          throw ((w.retryLane = l), Ya(e, l), Bt(m, e, l), hu);
        (Pu(x) || is(), (t = xu(e, t, n)));
      } else
        Pu(x)
          ? ((t.flags |= 192), (t.child = e.child), (t = null))
          : ((e = w.treeContext),
            (Be = ln(x.nextSibling)),
            (ft = t),
            (Te = !0),
            (ia = null),
            (nn = !1),
            e !== null && rd(t, e),
            (t = yu(t, l.children)),
            (t.flags |= 4096));
      return t;
    }
    return r
      ? (da(),
        (x = l.fallback),
        (r = t.mode),
        (w = e.child),
        (O = w.sibling),
        (l = An(w, { mode: "hidden", children: l.children })),
        (l.subtreeFlags = w.subtreeFlags & 65011712),
        O !== null ? (x = An(O, x)) : ((x = qa(x, r, n, null)), (x.flags |= 2)),
        (x.return = t),
        (l.return = t),
        (l.sibling = x),
        (t.child = l),
        Oi(null, l),
        (l = t.child),
        (x = e.child.memoizedState),
        x === null
          ? (x = vu(n))
          : ((r = x.cachePool),
            r !== null
              ? ((w = Ie._currentValue),
                (r = r.parent !== w ? { parent: w, pool: w } : r))
              : (r = dd()),
            (x = { baseLanes: x.baseLanes | n, cachePool: r })),
        (l.memoizedState = x),
        (l.childLanes = bu(e, m, n)),
        (t.memoizedState = pu),
        Oi(e.child, l))
      : (fa(t),
        (n = e.child),
        (e = n.sibling),
        (n = An(n, { mode: "visible", children: l.children })),
        (n.return = t),
        (n.sibling = null),
        e !== null &&
          ((m = t.deletions),
          m === null ? ((t.deletions = [e]), (t.flags |= 16)) : m.push(e)),
        (t.child = n),
        (t.memoizedState = null),
        n);
  }
  function yu(e, t) {
    return (
      (t = Fr({ mode: "visible", children: t }, e.mode)),
      (t.return = e),
      (e.child = t)
    );
  }
  function Fr(e, t) {
    return ((e = Vt(22, e, null, t)), (e.lanes = 0), e);
  }
  function xu(e, t, n) {
    return (
      $a(t, e.child, null, n),
      (e = yu(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function _m(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    (l !== null && (l.lanes |= t), ko(e.return, t, n));
  }
  function Su(e, t, n, l, r, u) {
    var m = e.memoizedState;
    m === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: l,
          tail: n,
          tailMode: r,
          treeForkCount: u,
        })
      : ((m.isBackwards = t),
        (m.rendering = null),
        (m.renderingStartTime = 0),
        (m.last = l),
        (m.tail = n),
        (m.tailMode = r),
        (m.treeForkCount = u));
  }
  function jm(e, t, n) {
    var l = t.pendingProps,
      r = l.revealOrder,
      u = l.tail;
    l = l.children;
    var m = Je.current,
      x = (m & 2) !== 0;
    if (
      (x ? ((m = (m & 1) | 2), (t.flags |= 128)) : (m &= 1),
      Z(Je, m),
      mt(e, t, l, n),
      (l = Te ? Si : 0),
      !x && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && _m(e, n, t);
        else if (e.tag === 19) _m(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (r) {
      case "forwards":
        for (n = t.child, r = null; n !== null; )
          ((e = n.alternate),
            e !== null && Br(e) === null && (r = n),
            (n = n.sibling));
        ((n = r),
          n === null
            ? ((r = t.child), (t.child = null))
            : ((r = n.sibling), (n.sibling = null)),
          Su(t, !1, r, n, u, l));
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, r = t.child, t.child = null; r !== null; ) {
          if (((e = r.alternate), e !== null && Br(e) === null)) {
            t.child = r;
            break;
          }
          ((e = r.sibling), (r.sibling = n), (n = r), (r = e));
        }
        Su(t, !0, n, null, u, l);
        break;
      case "together":
        Su(t, !1, null, null, void 0, l);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function kn(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies),
      (ga |= t.lanes),
      (n & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((jl(e, t, n, !1), (n & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(o(153));
    if (t.child !== null) {
      for (
        e = t.child, n = An(e, e.pendingProps), t.child = n, n.return = t;
        e.sibling !== null;
      )
        ((e = e.sibling),
          (n = n.sibling = An(e, e.pendingProps)),
          (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function Eu(e, t) {
    return (e.lanes & t) !== 0
      ? !0
      : ((e = e.dependencies), !!(e !== null && Rr(e)));
  }
  function dy(e, t, n) {
    switch (t.tag) {
      case 3:
        (de(t, t.stateNode.containerInfo),
          sa(t, Ie, e.memoizedState.cache),
          Va());
        break;
      case 27:
      case 5:
        Gt(t);
        break;
      case 4:
        de(t, t.stateNode.containerInfo);
        break;
      case 10:
        sa(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), Ko(t), null);
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null)
          return l.dehydrated !== null
            ? (fa(t), (t.flags |= 128), null)
            : (n & t.child.childLanes) !== 0
              ? Nm(e, t, n)
              : (fa(t), (e = kn(e, t, n)), e !== null ? e.sibling : null);
        fa(t);
        break;
      case 19:
        var r = (e.flags & 128) !== 0;
        if (
          ((l = (n & t.childLanes) !== 0),
          l || (jl(e, t, n, !1), (l = (n & t.childLanes) !== 0)),
          r)
        ) {
          if (l) return jm(e, t, n);
          t.flags |= 128;
        }
        if (
          ((r = t.memoizedState),
          r !== null &&
            ((r.rendering = null), (r.tail = null), (r.lastEffect = null)),
          Z(Je, Je.current),
          l)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), bm(e, t, n, t.pendingProps));
      case 24:
        sa(t, Ie, e.memoizedState.cache);
    }
    return kn(e, t, n);
  }
  function Tm(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) et = !0;
      else {
        if (!Eu(e, n) && (t.flags & 128) === 0) return ((et = !1), dy(e, t, n));
        et = (e.flags & 131072) !== 0;
      }
    else ((et = !1), Te && (t.flags & 1048576) !== 0 && id(t, Si, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (((e = Ka(t.elementType)), (t.type = e), typeof e == "function"))
            To(e)
              ? ((l = Wa(e, l)), (t.tag = 1), (t = Em(null, t, e, l, n)))
              : ((t.tag = 0), (t = gu(null, t, e, l, n)));
          else {
            if (e != null) {
              var r = e.$$typeof;
              if (r === F) {
                ((t.tag = 11), (t = gm(null, t, e, l, n)));
                break e;
              } else if (r === B) {
                ((t.tag = 14), (t = pm(null, t, e, l, n)));
                break e;
              }
            }
            throw ((t = Qe(e) || e), Error(o(306, t, "")));
          }
        }
        return t;
      case 0:
        return gu(e, t, t.type, t.pendingProps, n);
      case 1:
        return ((l = t.type), (r = Wa(l, t.pendingProps)), Em(e, t, l, r, n));
      case 3:
        e: {
          if ((de(t, t.stateNode.containerInfo), e === null))
            throw Error(o(387));
          l = t.pendingProps;
          var u = t.memoizedState;
          ((r = u.element), qo(e, t), Ai(t, l, null, n));
          var m = t.memoizedState;
          if (
            ((l = m.cache),
            sa(t, Ie, l),
            l !== u.cache && Uo(t, [Ie], n, !0),
            Ci(),
            (l = m.element),
            u.isDehydrated)
          )
            if (
              ((u = { element: l, isDehydrated: !1, cache: m.cache }),
              (t.updateQueue.baseState = u),
              (t.memoizedState = u),
              t.flags & 256)
            ) {
              t = wm(e, t, l, n);
              break e;
            } else if (l !== r) {
              ((r = Pt(Error(o(424)), t)), Ei(r), (t = wm(e, t, l, n)));
              break e;
            } else
              for (
                e = t.stateNode.containerInfo,
                  e.nodeType === 9
                    ? (e = e.body)
                    : (e = e.nodeName === "HTML" ? e.ownerDocument.body : e),
                  Be = ln(e.firstChild),
                  ft = t,
                  Te = !0,
                  ia = null,
                  nn = !0,
                  n = bd(t, null, l, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
          else {
            if ((Va(), l === r)) {
              t = kn(e, t, n);
              break e;
            }
            mt(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          $r(e, t),
          e === null
            ? (n = Bh(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = n)
              : Te ||
                ((n = t.type),
                (e = t.pendingProps),
                (l = ds(te.current).createElement(n)),
                (l[ct] = t),
                (l[Mt] = e),
                ht(l, n, e),
                st(l),
                (t.stateNode = l))
            : (t.memoizedState = Bh(
                t.type,
                e.memoizedProps,
                t.pendingProps,
                e.memoizedState,
              )),
          null
        );
      case 27:
        return (
          Gt(t),
          e === null &&
            Te &&
            ((l = t.stateNode = kh(t.type, t.pendingProps, te.current)),
            (ft = t),
            (nn = !0),
            (r = Be),
            xa(t.type) ? ((tc = r), (Be = ln(l.firstChild))) : (Be = r)),
          mt(e, t, t.pendingProps.children, n),
          $r(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            Te &&
            ((r = l = Be) &&
              ((l = qy(l, t.type, t.pendingProps, nn)),
              l !== null
                ? ((t.stateNode = l),
                  (ft = t),
                  (Be = ln(l.firstChild)),
                  (nn = !1),
                  (r = !0))
                : (r = !1)),
            r || ra(t)),
          Gt(t),
          (r = t.type),
          (u = t.pendingProps),
          (m = e !== null ? e.memoizedProps : null),
          (l = u.children),
          Fu(r, u) ? (l = null) : m !== null && Fu(r, m) && (t.flags |= 32),
          t.memoizedState !== null &&
            ((r = $o(e, t, ay, null, null, n)), ($i._currentValue = r)),
          $r(e, t),
          mt(e, t, l, n),
          t.child
        );
      case 6:
        return (
          e === null &&
            Te &&
            ((e = n = Be) &&
              ((n = Vy(n, t.pendingProps, nn)),
              n !== null
                ? ((t.stateNode = n), (ft = t), (Be = null), (e = !0))
                : (e = !1)),
            e || ra(t)),
          null
        );
      case 13:
        return Nm(e, t, n);
      case 4:
        return (
          de(t, t.stateNode.containerInfo),
          (l = t.pendingProps),
          e === null ? (t.child = $a(t, null, l, n)) : mt(e, t, l, n),
          t.child
        );
      case 11:
        return gm(e, t, t.type, t.pendingProps, n);
      case 7:
        return (mt(e, t, t.pendingProps, n), t.child);
      case 8:
        return (mt(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (mt(e, t, t.pendingProps.children, n), t.child);
      case 10:
        return (
          (l = t.pendingProps),
          sa(t, t.type, l.value),
          mt(e, t, l.children, n),
          t.child
        );
      case 9:
        return (
          (r = t.type._context),
          (l = t.pendingProps.children),
          Qa(t),
          (r = dt(r)),
          (l = l(r)),
          (t.flags |= 1),
          mt(e, t, l, n),
          t.child
        );
      case 14:
        return pm(e, t, t.type, t.pendingProps, n);
      case 15:
        return vm(e, t, t.type, t.pendingProps, n);
      case 19:
        return jm(e, t, n);
      case 31:
        return fy(e, t, n);
      case 22:
        return bm(e, t, n, t.pendingProps);
      case 24:
        return (
          Qa(t),
          (l = dt(Ie)),
          e === null
            ? ((r = Ho()),
              r === null &&
                ((r = Ue),
                (u = Lo()),
                (r.pooledCache = u),
                u.refCount++,
                u !== null && (r.pooledCacheLanes |= n),
                (r = u)),
              (t.memoizedState = { parent: l, cache: r }),
              Yo(t),
              sa(t, Ie, r))
            : ((e.lanes & n) !== 0 && (qo(e, t), Ai(t, null, null, n), Ci()),
              (r = e.memoizedState),
              (u = t.memoizedState),
              r.parent !== l
                ? ((r = { parent: l, cache: l }),
                  (t.memoizedState = r),
                  t.lanes === 0 &&
                    (t.memoizedState = t.updateQueue.baseState = r),
                  sa(t, Ie, l))
                : ((l = u.cache),
                  sa(t, Ie, l),
                  l !== r.cache && Uo(t, [Ie], n, !0))),
          mt(e, t, t.pendingProps.children, n),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(o(156, t.tag));
  }
  function Un(e) {
    e.flags |= 4;
  }
  function wu(e, t, n, l, r) {
    if (((t = (e.mode & 32) !== 0) && (t = !1), t)) {
      if (((e.flags |= 16777216), (r & 335544128) === r))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (eh()) e.flags |= 8192;
        else throw ((Ja = Or), Go);
    } else e.flags &= -16777217;
  }
  function Cm(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (((e.flags |= 16777216), !Vh(t)))
      if (eh()) e.flags |= 8192;
      else throw ((Ja = Or), Go);
  }
  function Wr(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 &&
        ((t = e.tag !== 22 ? xt() : 536870912), (e.lanes |= t), (Bl |= t)));
  }
  function ki(e, t) {
    if (!Te)
      switch (e.tailMode) {
        case "hidden":
          t = e.tail;
          for (var n = null; t !== null; )
            (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
          break;
        case "collapsed":
          n = e.tail;
          for (var l = null; n !== null; )
            (n.alternate !== null && (l = n), (n = n.sibling));
          l === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (l.sibling = null);
      }
  }
  function He(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      l = 0;
    if (t)
      for (var r = e.child; r !== null; )
        ((n |= r.lanes | r.childLanes),
          (l |= r.subtreeFlags & 65011712),
          (l |= r.flags & 65011712),
          (r.return = e),
          (r = r.sibling));
    else
      for (r = e.child; r !== null; )
        ((n |= r.lanes | r.childLanes),
          (l |= r.subtreeFlags),
          (l |= r.flags),
          (r.return = e),
          (r = r.sibling));
    return ((e.subtreeFlags |= l), (e.childLanes = n), t);
  }
  function my(e, t, n) {
    var l = t.pendingProps;
    switch ((zo(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (He(t), null);
      case 1:
        return (He(t), null);
      case 3:
        return (
          (n = t.stateNode),
          (l = null),
          e !== null && (l = e.memoizedState.cache),
          t.memoizedState.cache !== l && (t.flags |= 2048),
          Mn(Ie),
          ue(),
          n.pendingContext &&
            ((n.context = n.pendingContext), (n.pendingContext = null)),
          (e === null || e.child === null) &&
            (_l(t)
              ? Un(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), Do())),
          He(t),
          null
        );
      case 26:
        var r = t.type,
          u = t.memoizedState;
        return (
          e === null
            ? (Un(t),
              u !== null ? (He(t), Cm(t, u)) : (He(t), wu(t, r, null, l, n)))
            : u
              ? u !== e.memoizedState
                ? (Un(t), He(t), Cm(t, u))
                : (He(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps),
                e !== l && Un(t),
                He(t),
                wu(t, r, e, l, n)),
          null
        );
      case 27:
        if (
          (Ct(t),
          (n = te.current),
          (r = t.type),
          e !== null && t.stateNode != null)
        )
          e.memoizedProps !== l && Un(t);
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(o(166));
            return (He(t), null);
          }
          ((e = I.current),
            _l(t) ? sd(t) : ((e = kh(r, l, n)), (t.stateNode = e), Un(t)));
        }
        return (He(t), null);
      case 5:
        if ((Ct(t), (r = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== l && Un(t);
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(o(166));
            return (He(t), null);
          }
          if (((u = I.current), _l(t))) sd(t);
          else {
            var m = ds(te.current);
            switch (u) {
              case 1:
                u = m.createElementNS("http://www.w3.org/2000/svg", r);
                break;
              case 2:
                u = m.createElementNS("http://www.w3.org/1998/Math/MathML", r);
                break;
              default:
                switch (r) {
                  case "svg":
                    u = m.createElementNS("http://www.w3.org/2000/svg", r);
                    break;
                  case "math":
                    u = m.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      r,
                    );
                    break;
                  case "script":
                    ((u = m.createElement("div")),
                      (u.innerHTML = "<script><\/script>"),
                      (u = u.removeChild(u.firstChild)));
                    break;
                  case "select":
                    ((u =
                      typeof l.is == "string"
                        ? m.createElement("select", { is: l.is })
                        : m.createElement("select")),
                      l.multiple
                        ? (u.multiple = !0)
                        : l.size && (u.size = l.size));
                    break;
                  default:
                    u =
                      typeof l.is == "string"
                        ? m.createElement(r, { is: l.is })
                        : m.createElement(r);
                }
            }
            ((u[ct] = t), (u[Mt] = l));
            e: for (m = t.child; m !== null; ) {
              if (m.tag === 5 || m.tag === 6) u.appendChild(m.stateNode);
              else if (m.tag !== 4 && m.tag !== 27 && m.child !== null) {
                ((m.child.return = m), (m = m.child));
                continue;
              }
              if (m === t) break e;
              for (; m.sibling === null; ) {
                if (m.return === null || m.return === t) break e;
                m = m.return;
              }
              ((m.sibling.return = m.return), (m = m.sibling));
            }
            t.stateNode = u;
            e: switch ((ht(u, r, l), r)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                l = !!l.autoFocus;
                break e;
              case "img":
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && Un(t);
          }
        }
        return (
          He(t),
          wu(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n),
          null
        );
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== l && Un(t);
        else {
          if (typeof l != "string" && t.stateNode === null) throw Error(o(166));
          if (((e = te.current), _l(t))) {
            if (
              ((e = t.stateNode),
              (n = t.memoizedProps),
              (l = null),
              (r = ft),
              r !== null)
            )
              switch (r.tag) {
                case 27:
                case 5:
                  l = r.memoizedProps;
              }
            ((e[ct] = t),
              (e = !!(
                e.nodeValue === n ||
                (l !== null && l.suppressHydrationWarning === !0) ||
                Nh(e.nodeValue, n)
              )),
              e || ra(t, !0));
          } else
            ((e = ds(e).createTextNode(l)), (e[ct] = t), (t.stateNode = e));
        }
        return (He(t), null);
      case 31:
        if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((l = _l(t)), n !== null)) {
            if (e === null) {
              if (!l) throw Error(o(318));
              if (
                ((e = t.memoizedState),
                (e = e !== null ? e.dehydrated : null),
                !e)
              )
                throw Error(o(557));
              e[ct] = t;
            } else
              (Va(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (He(t), (e = !1));
          } else
            ((n = Do()),
              e !== null &&
                e.memoizedState !== null &&
                (e.memoizedState.hydrationErrors = n),
              (e = !0));
          if (!e) return t.flags & 256 ? (Qt(t), t) : (Qt(t), null);
          if ((t.flags & 128) !== 0) throw Error(o(558));
        }
        return (He(t), null);
      case 13:
        if (
          ((l = t.memoizedState),
          e === null ||
            (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((r = _l(t)), l !== null && l.dehydrated !== null)) {
            if (e === null) {
              if (!r) throw Error(o(318));
              if (
                ((r = t.memoizedState),
                (r = r !== null ? r.dehydrated : null),
                !r)
              )
                throw Error(o(317));
              r[ct] = t;
            } else
              (Va(),
                (t.flags & 128) === 0 && (t.memoizedState = null),
                (t.flags |= 4));
            (He(t), (r = !1));
          } else
            ((r = Do()),
              e !== null &&
                e.memoizedState !== null &&
                (e.memoizedState.hydrationErrors = r),
              (r = !0));
          if (!r) return t.flags & 256 ? (Qt(t), t) : (Qt(t), null);
        }
        return (
          Qt(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = n), t)
            : ((n = l !== null),
              (e = e !== null && e.memoizedState !== null),
              n &&
                ((l = t.child),
                (r = null),
                l.alternate !== null &&
                  l.alternate.memoizedState !== null &&
                  l.alternate.memoizedState.cachePool !== null &&
                  (r = l.alternate.memoizedState.cachePool.pool),
                (u = null),
                l.memoizedState !== null &&
                  l.memoizedState.cachePool !== null &&
                  (u = l.memoizedState.cachePool.pool),
                u !== r && (l.flags |= 2048)),
              n !== e && n && (t.child.flags |= 8192),
              Wr(t, t.updateQueue),
              He(t),
              null)
        );
      case 4:
        return (ue(), e === null && Qu(t.stateNode.containerInfo), He(t), null);
      case 10:
        return (Mn(t.type), He(t), null);
      case 19:
        if ((q(Je), (l = t.memoizedState), l === null)) return (He(t), null);
        if (((r = (t.flags & 128) !== 0), (u = l.rendering), u === null))
          if (r) ki(l, !1);
          else {
            if (Ke !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null; ) {
                if (((u = Br(e)), u !== null)) {
                  for (
                    t.flags |= 128,
                      ki(l, !1),
                      e = u.updateQueue,
                      t.updateQueue = e,
                      Wr(t, e),
                      t.subtreeFlags = 0,
                      e = n,
                      n = t.child;
                    n !== null;
                  )
                    (nd(n, e), (n = n.sibling));
                  return (
                    Z(Je, (Je.current & 1) | 2),
                    Te && Rn(t, l.treeForkCount),
                    t.child
                  );
                }
                e = e.sibling;
              }
            l.tail !== null &&
              _t() > ns &&
              ((t.flags |= 128), (r = !0), ki(l, !1), (t.lanes = 4194304));
          }
        else {
          if (!r)
            if (((e = Br(u)), e !== null)) {
              if (
                ((t.flags |= 128),
                (r = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                Wr(t, e),
                ki(l, !0),
                l.tail === null &&
                  l.tailMode === "hidden" &&
                  !u.alternate &&
                  !Te)
              )
                return (He(t), null);
            } else
              2 * _t() - l.renderingStartTime > ns &&
                n !== 536870912 &&
                ((t.flags |= 128), (r = !0), ki(l, !1), (t.lanes = 4194304));
          l.isBackwards
            ? ((u.sibling = t.child), (t.child = u))
            : ((e = l.last),
              e !== null ? (e.sibling = u) : (t.child = u),
              (l.last = u));
        }
        return l.tail !== null
          ? ((e = l.tail),
            (l.rendering = e),
            (l.tail = e.sibling),
            (l.renderingStartTime = _t()),
            (e.sibling = null),
            (n = Je.current),
            Z(Je, r ? (n & 1) | 2 : n & 1),
            Te && Rn(t, l.treeForkCount),
            e)
          : (He(t), null);
      case 22:
      case 23:
        return (
          Qt(t),
          Zo(),
          (l = t.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== l && (t.flags |= 8192)
            : l && (t.flags |= 8192),
          l
            ? (n & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (He(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : He(t),
          (n = t.updateQueue),
          n !== null && Wr(t, n.retryQueue),
          (n = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (n = e.memoizedState.cachePool.pool),
          (l = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          l !== n && (t.flags |= 2048),
          e !== null && q(Za),
          null
        );
      case 24:
        return (
          (n = null),
          e !== null && (n = e.memoizedState.cache),
          t.memoizedState.cache !== n && (t.flags |= 2048),
          Mn(Ie),
          He(t),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(o(156, t.tag));
  }
  function hy(e, t) {
    switch ((zo(t), t.tag)) {
      case 1:
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 3:
        return (
          Mn(Ie),
          ue(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0
            ? ((t.flags = (e & -65537) | 128), t)
            : null
        );
      case 26:
      case 27:
      case 5:
        return (Ct(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((Qt(t), t.alternate === null)) throw Error(o(340));
          Va();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 13:
        if (
          (Qt(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)
        ) {
          if (t.alternate === null) throw Error(o(340));
          Va();
        }
        return (
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 19:
        return (q(Je), null);
      case 4:
        return (ue(), null);
      case 10:
        return (Mn(t.type), null);
      case 22:
      case 23:
        return (
          Qt(t),
          Zo(),
          e !== null && q(Za),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (Mn(Ie), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Am(e, t) {
    switch ((zo(t), t.tag)) {
      case 3:
        (Mn(Ie), ue());
        break;
      case 26:
      case 27:
      case 5:
        Ct(t);
        break;
      case 4:
        ue();
        break;
      case 31:
        t.memoizedState !== null && Qt(t);
        break;
      case 13:
        Qt(t);
        break;
      case 19:
        q(Je);
        break;
      case 10:
        Mn(t.type);
        break;
      case 22:
      case 23:
        (Qt(t), Zo(), e !== null && q(Za));
        break;
      case 24:
        Mn(Ie);
    }
  }
  function Ui(e, t) {
    try {
      var n = t.updateQueue,
        l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var r = l.next;
        n = r;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var u = n.create,
              m = n.inst;
            ((l = u()), (m.destroy = l));
          }
          n = n.next;
        } while (n !== r);
      }
    } catch (x) {
      Me(t, t.return, x);
    }
  }
  function ma(e, t, n) {
    try {
      var l = t.updateQueue,
        r = l !== null ? l.lastEffect : null;
      if (r !== null) {
        var u = r.next;
        l = u;
        do {
          if ((l.tag & e) === e) {
            var m = l.inst,
              x = m.destroy;
            if (x !== void 0) {
              ((m.destroy = void 0), (r = t));
              var w = n,
                O = x;
              try {
                O();
              } catch (G) {
                Me(r, w, G);
              }
            }
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (G) {
      Me(t, t.return, G);
    }
  }
  function Rm(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        xd(t, n);
      } catch (l) {
        Me(e, e.return, l);
      }
    }
  }
  function zm(e, t, n) {
    ((n.props = Wa(e.type, e.memoizedProps)), (n.state = e.memoizedState));
    try {
      n.componentWillUnmount();
    } catch (l) {
      Me(e, t, l);
    }
  }
  function Li(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof n == "function" ? (e.refCleanup = n(l)) : (n.current = l);
      }
    } catch (r) {
      Me(e, t, r);
    }
  }
  function bn(e, t) {
    var n = e.ref,
      l = e.refCleanup;
    if (n !== null)
      if (typeof l == "function")
        try {
          l();
        } catch (r) {
          Me(e, t, r);
        } finally {
          ((e.refCleanup = null),
            (e = e.alternate),
            e != null && (e.refCleanup = null));
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (r) {
          Me(e, t, r);
        }
      else n.current = null;
  }
  function Mm(e) {
    var t = e.type,
      n = e.memoizedProps,
      l = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && l.focus();
          break e;
        case "img":
          n.src ? (l.src = n.src) : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (r) {
      Me(e, e.return, r);
    }
  }
  function Nu(e, t, n) {
    try {
      var l = e.stateNode;
      (Uy(l, e.type, n, t), (l[Mt] = t));
    } catch (r) {
      Me(e, e.return, r);
    }
  }
  function Dm(e) {
    return (
      e.tag === 5 ||
      e.tag === 3 ||
      e.tag === 26 ||
      (e.tag === 27 && xa(e.type)) ||
      e.tag === 4
    );
  }
  function _u(e) {
    e: for (;;) {
      for (; e.sibling === null; ) {
        if (e.return === null || Dm(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if (
          (e.tag === 27 && xa(e.type)) ||
          e.flags & 2 ||
          e.child === null ||
          e.tag === 4
        )
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function ju(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      ((e = e.stateNode),
        t
          ? (n.nodeType === 9
              ? n.body
              : n.nodeName === "HTML"
                ? n.ownerDocument.body
                : n
            ).insertBefore(e, t)
          : ((t =
              n.nodeType === 9
                ? n.body
                : n.nodeName === "HTML"
                  ? n.ownerDocument.body
                  : n),
            t.appendChild(e),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = Tn)));
    else if (
      l !== 4 &&
      (l === 27 && xa(e.type) && ((n = e.stateNode), (t = null)),
      (e = e.child),
      e !== null)
    )
      for (ju(e, t, n), e = e.sibling; e !== null; )
        (ju(e, t, n), (e = e.sibling));
  }
  function Ir(e, t, n) {
    var l = e.tag;
    if (l === 5 || l === 6)
      ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
    else if (
      l !== 4 &&
      (l === 27 && xa(e.type) && (n = e.stateNode), (e = e.child), e !== null)
    )
      for (Ir(e, t, n), e = e.sibling; e !== null; )
        (Ir(e, t, n), (e = e.sibling));
  }
  function Om(e) {
    var t = e.stateNode,
      n = e.memoizedProps;
    try {
      for (var l = e.type, r = t.attributes; r.length; )
        t.removeAttributeNode(r[0]);
      (ht(t, l, n), (t[ct] = e), (t[Mt] = n));
    } catch (u) {
      Me(e, e.return, u);
    }
  }
  var Ln = !1,
    tt = !1,
    Tu = !1,
    km = typeof WeakSet == "function" ? WeakSet : Set,
    ot = null;
  function gy(e, t) {
    if (((e = e.containerInfo), (Ju = ys), (e = Kf(e)), xo(e))) {
      if ("selectionStart" in e)
        var n = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          n = ((n = e.ownerDocument) && n.defaultView) || window;
          var l = n.getSelection && n.getSelection();
          if (l && l.rangeCount !== 0) {
            n = l.anchorNode;
            var r = l.anchorOffset,
              u = l.focusNode;
            l = l.focusOffset;
            try {
              (n.nodeType, u.nodeType);
            } catch {
              n = null;
              break e;
            }
            var m = 0,
              x = -1,
              w = -1,
              O = 0,
              G = 0,
              Q = e,
              k = null;
            t: for (;;) {
              for (
                var U;
                Q !== n || (r !== 0 && Q.nodeType !== 3) || (x = m + r),
                  Q !== u || (l !== 0 && Q.nodeType !== 3) || (w = m + l),
                  Q.nodeType === 3 && (m += Q.nodeValue.length),
                  (U = Q.firstChild) !== null;
              )
                ((k = Q), (Q = U));
              for (;;) {
                if (Q === e) break t;
                if (
                  (k === n && ++O === r && (x = m),
                  k === u && ++G === l && (w = m),
                  (U = Q.nextSibling) !== null)
                )
                  break;
                ((Q = k), (k = Q.parentNode));
              }
              Q = U;
            }
            n = x === -1 || w === -1 ? null : { start: x, end: w };
          } else n = null;
        }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (
      $u = { focusedElem: e, selectionRange: n }, ys = !1, ot = t;
      ot !== null;
    )
      if (
        ((t = ot), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null)
      )
        ((e.return = t), (ot = e));
      else
        for (; ot !== null; ) {
          switch (((t = ot), (u = t.alternate), (e = t.flags), t.tag)) {
            case 0:
              if (
                (e & 4) !== 0 &&
                ((e = t.updateQueue),
                (e = e !== null ? e.events : null),
                e !== null)
              )
                for (n = 0; n < e.length; n++)
                  ((r = e[n]), (r.ref.impl = r.nextImpl));
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((e & 1024) !== 0 && u !== null) {
                ((e = void 0),
                  (n = t),
                  (r = u.memoizedProps),
                  (u = u.memoizedState),
                  (l = n.stateNode));
                try {
                  var ne = Wa(n.type, r);
                  ((e = l.getSnapshotBeforeUpdate(ne, u)),
                    (l.__reactInternalSnapshotBeforeUpdate = e));
                } catch (oe) {
                  Me(n, n.return, oe);
                }
              }
              break;
            case 3:
              if ((e & 1024) !== 0) {
                if (
                  ((e = t.stateNode.containerInfo), (n = e.nodeType), n === 9)
                )
                  Iu(e);
                else if (n === 1)
                  switch (e.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      Iu(e);
                      break;
                    default:
                      e.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((e & 1024) !== 0) throw Error(o(163));
          }
          if (((e = t.sibling), e !== null)) {
            ((e.return = t.return), (ot = e));
            break;
          }
          ot = t.return;
        }
  }
  function Um(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        (Hn(e, n), l & 4 && Ui(5, n));
        break;
      case 1:
        if ((Hn(e, n), l & 4))
          if (((e = n.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (m) {
              Me(n, n.return, m);
            }
          else {
            var r = Wa(n.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(r, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (m) {
              Me(n, n.return, m);
            }
          }
        (l & 64 && Rm(n), l & 512 && Li(n, n.return));
        break;
      case 3:
        if ((Hn(e, n), l & 64 && ((e = n.updateQueue), e !== null))) {
          if (((t = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            xd(e, t);
          } catch (m) {
            Me(n, n.return, m);
          }
        }
        break;
      case 27:
        t === null && l & 4 && Om(n);
      case 26:
      case 5:
        (Hn(e, n), t === null && l & 4 && Mm(n), l & 512 && Li(n, n.return));
        break;
      case 12:
        Hn(e, n);
        break;
      case 31:
        (Hn(e, n), l & 4 && Hm(e, n));
        break;
      case 13:
        (Hn(e, n),
          l & 4 && Gm(e, n),
          l & 64 &&
            ((e = n.memoizedState),
            e !== null &&
              ((e = e.dehydrated),
              e !== null && ((n = Ny.bind(null, n)), Xy(e, n)))));
        break;
      case 22:
        if (((l = n.memoizedState !== null || Ln), !l)) {
          ((t = (t !== null && t.memoizedState !== null) || tt), (r = Ln));
          var u = tt;
          ((Ln = l),
            (tt = t) && !u ? Gn(e, n, (n.subtreeFlags & 8772) !== 0) : Hn(e, n),
            (Ln = r),
            (tt = u));
        }
        break;
      case 30:
        break;
      default:
        Hn(e, n);
    }
  }
  function Lm(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), Lm(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && no(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var Ye = null,
    Ot = !1;
  function Bn(e, t, n) {
    for (n = n.child; n !== null; ) (Bm(e, t, n), (n = n.sibling));
  }
  function Bm(e, t, n) {
    if (jt && typeof jt.onCommitFiberUnmount == "function")
      try {
        jt.onCommitFiberUnmount(Oa, n);
      } catch {}
    switch (n.tag) {
      case 26:
        (tt || bn(n, t),
          Bn(e, t, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && ((n = n.stateNode), n.parentNode.removeChild(n)));
        break;
      case 27:
        tt || bn(n, t);
        var l = Ye,
          r = Ot;
        (xa(n.type) && ((Ye = n.stateNode), (Ot = !1)),
          Bn(e, t, n),
          Zi(n.stateNode),
          (Ye = l),
          (Ot = r));
        break;
      case 5:
        tt || bn(n, t);
      case 6:
        if (
          ((l = Ye),
          (r = Ot),
          (Ye = null),
          Bn(e, t, n),
          (Ye = l),
          (Ot = r),
          Ye !== null)
        )
          if (Ot)
            try {
              (Ye.nodeType === 9
                ? Ye.body
                : Ye.nodeName === "HTML"
                  ? Ye.ownerDocument.body
                  : Ye
              ).removeChild(n.stateNode);
            } catch (u) {
              Me(n, t, u);
            }
          else
            try {
              Ye.removeChild(n.stateNode);
            } catch (u) {
              Me(n, t, u);
            }
        break;
      case 18:
        Ye !== null &&
          (Ot
            ? ((e = Ye),
              Rh(
                e.nodeType === 9
                  ? e.body
                  : e.nodeName === "HTML"
                    ? e.ownerDocument.body
                    : e,
                n.stateNode,
              ),
              Zl(e))
            : Rh(Ye, n.stateNode));
        break;
      case 4:
        ((l = Ye),
          (r = Ot),
          (Ye = n.stateNode.containerInfo),
          (Ot = !0),
          Bn(e, t, n),
          (Ye = l),
          (Ot = r));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (ma(2, n, t), tt || ma(4, n, t), Bn(e, t, n));
        break;
      case 1:
        (tt ||
          (bn(n, t),
          (l = n.stateNode),
          typeof l.componentWillUnmount == "function" && zm(n, t, l)),
          Bn(e, t, n));
        break;
      case 21:
        Bn(e, t, n);
        break;
      case 22:
        ((tt = (l = tt) || n.memoizedState !== null), Bn(e, t, n), (tt = l));
        break;
      default:
        Bn(e, t, n);
    }
  }
  function Hm(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        Zl(e);
      } catch (n) {
        Me(t, t.return, n);
      }
    }
  }
  function Gm(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null &&
        ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        Zl(e);
      } catch (n) {
        Me(t, t.return, n);
      }
  }
  function py(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new km()), t);
      case 22:
        return (
          (e = e.stateNode),
          (t = e._retryCache),
          t === null && (t = e._retryCache = new km()),
          t
        );
      default:
        throw Error(o(435, e.tag));
    }
  }
  function Pr(e, t) {
    var n = py(e);
    t.forEach(function (l) {
      if (!n.has(l)) {
        n.add(l);
        var r = _y.bind(null, e, l);
        l.then(r, r);
      }
    });
  }
  function kt(e, t) {
    var n = t.deletions;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var r = n[l],
          u = e,
          m = t,
          x = m;
        e: for (; x !== null; ) {
          switch (x.tag) {
            case 27:
              if (xa(x.type)) {
                ((Ye = x.stateNode), (Ot = !1));
                break e;
              }
              break;
            case 5:
              ((Ye = x.stateNode), (Ot = !1));
              break e;
            case 3:
            case 4:
              ((Ye = x.stateNode.containerInfo), (Ot = !0));
              break e;
          }
          x = x.return;
        }
        if (Ye === null) throw Error(o(160));
        (Bm(u, m, r),
          (Ye = null),
          (Ot = !1),
          (u = r.alternate),
          u !== null && (u.return = null),
          (r.return = null));
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; ) (Ym(t, e), (t = t.sibling));
  }
  var fn = null;
  function Ym(e, t) {
    var n = e.alternate,
      l = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        (kt(t, e),
          Ut(e),
          l & 4 && (ma(3, e, e.return), Ui(3, e), ma(5, e, e.return)));
        break;
      case 1:
        (kt(t, e),
          Ut(e),
          l & 512 && (tt || n === null || bn(n, n.return)),
          l & 64 &&
            Ln &&
            ((e = e.updateQueue),
            e !== null &&
              ((l = e.callbacks),
              l !== null &&
                ((n = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = n === null ? l : n.concat(l))))));
        break;
      case 26:
        var r = fn;
        if (
          (kt(t, e),
          Ut(e),
          l & 512 && (tt || n === null || bn(n, n.return)),
          l & 4)
        ) {
          var u = n !== null ? n.memoizedState : null;
          if (((l = e.memoizedState), n === null))
            if (l === null)
              if (e.stateNode === null) {
                e: {
                  ((l = e.type),
                    (n = e.memoizedProps),
                    (r = r.ownerDocument || r));
                  t: switch (l) {
                    case "title":
                      ((u = r.getElementsByTagName("title")[0]),
                        (!u ||
                          u[ci] ||
                          u[ct] ||
                          u.namespaceURI === "http://www.w3.org/2000/svg" ||
                          u.hasAttribute("itemprop")) &&
                          ((u = r.createElement(l)),
                          r.head.insertBefore(
                            u,
                            r.querySelector("head > title"),
                          )),
                        ht(u, l, n),
                        (u[ct] = e),
                        st(u),
                        (l = u));
                      break e;
                    case "link":
                      var m = Yh("link", "href", r).get(l + (n.href || ""));
                      if (m) {
                        for (var x = 0; x < m.length; x++)
                          if (
                            ((u = m[x]),
                            u.getAttribute("href") ===
                              (n.href == null || n.href === ""
                                ? null
                                : n.href) &&
                              u.getAttribute("rel") ===
                                (n.rel == null ? null : n.rel) &&
                              u.getAttribute("title") ===
                                (n.title == null ? null : n.title) &&
                              u.getAttribute("crossorigin") ===
                                (n.crossOrigin == null ? null : n.crossOrigin))
                          ) {
                            m.splice(x, 1);
                            break t;
                          }
                      }
                      ((u = r.createElement(l)),
                        ht(u, l, n),
                        r.head.appendChild(u));
                      break;
                    case "meta":
                      if (
                        (m = Yh("meta", "content", r).get(
                          l + (n.content || ""),
                        ))
                      ) {
                        for (x = 0; x < m.length; x++)
                          if (
                            ((u = m[x]),
                            u.getAttribute("content") ===
                              (n.content == null ? null : "" + n.content) &&
                              u.getAttribute("name") ===
                                (n.name == null ? null : n.name) &&
                              u.getAttribute("property") ===
                                (n.property == null ? null : n.property) &&
                              u.getAttribute("http-equiv") ===
                                (n.httpEquiv == null ? null : n.httpEquiv) &&
                              u.getAttribute("charset") ===
                                (n.charSet == null ? null : n.charSet))
                          ) {
                            m.splice(x, 1);
                            break t;
                          }
                      }
                      ((u = r.createElement(l)),
                        ht(u, l, n),
                        r.head.appendChild(u));
                      break;
                    default:
                      throw Error(o(468, l));
                  }
                  ((u[ct] = e), st(u), (l = u));
                }
                e.stateNode = l;
              } else qh(r, e.type, e.stateNode);
            else e.stateNode = Gh(r, l, e.memoizedProps);
          else
            u !== l
              ? (u === null
                  ? n.stateNode !== null &&
                    ((n = n.stateNode), n.parentNode.removeChild(n))
                  : u.count--,
                l === null
                  ? qh(r, e.type, e.stateNode)
                  : Gh(r, l, e.memoizedProps))
              : l === null &&
                e.stateNode !== null &&
                Nu(e, e.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        (kt(t, e),
          Ut(e),
          l & 512 && (tt || n === null || bn(n, n.return)),
          n !== null && l & 4 && Nu(e, e.memoizedProps, n.memoizedProps));
        break;
      case 5:
        if (
          (kt(t, e),
          Ut(e),
          l & 512 && (tt || n === null || bn(n, n.return)),
          e.flags & 32)
        ) {
          r = e.stateNode;
          try {
            gl(r, "");
          } catch (ne) {
            Me(e, e.return, ne);
          }
        }
        (l & 4 &&
          e.stateNode != null &&
          ((r = e.memoizedProps), Nu(e, r, n !== null ? n.memoizedProps : r)),
          l & 1024 && (Tu = !0));
        break;
      case 6:
        if ((kt(t, e), Ut(e), l & 4)) {
          if (e.stateNode === null) throw Error(o(162));
          ((l = e.memoizedProps), (n = e.stateNode));
          try {
            n.nodeValue = l;
          } catch (ne) {
            Me(e, e.return, ne);
          }
        }
        break;
      case 3:
        if (
          ((gs = null),
          (r = fn),
          (fn = ms(t.containerInfo)),
          kt(t, e),
          (fn = r),
          Ut(e),
          l & 4 && n !== null && n.memoizedState.isDehydrated)
        )
          try {
            Zl(t.containerInfo);
          } catch (ne) {
            Me(e, e.return, ne);
          }
        Tu && ((Tu = !1), qm(e));
        break;
      case 4:
        ((l = fn),
          (fn = ms(e.stateNode.containerInfo)),
          kt(t, e),
          Ut(e),
          (fn = l));
        break;
      case 12:
        (kt(t, e), Ut(e));
        break;
      case 31:
        (kt(t, e),
          Ut(e),
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((e.updateQueue = null), Pr(e, l))));
        break;
      case 13:
        (kt(t, e),
          Ut(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) !=
              (n !== null && n.memoizedState !== null) &&
            (ts = _t()),
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((e.updateQueue = null), Pr(e, l))));
        break;
      case 22:
        r = e.memoizedState !== null;
        var w = n !== null && n.memoizedState !== null,
          O = Ln,
          G = tt;
        if (
          ((Ln = O || r),
          (tt = G || w),
          kt(t, e),
          (tt = G),
          (Ln = O),
          Ut(e),
          l & 8192)
        )
          e: for (
            t = e.stateNode,
              t._visibility = r ? t._visibility & -2 : t._visibility | 1,
              r && (n === null || w || Ln || tt || Ia(e)),
              n = null,
              t = e;
            ;
          ) {
            if (t.tag === 5 || t.tag === 26) {
              if (n === null) {
                w = n = t;
                try {
                  if (((u = w.stateNode), r))
                    ((m = u.style),
                      typeof m.setProperty == "function"
                        ? m.setProperty("display", "none", "important")
                        : (m.display = "none"));
                  else {
                    x = w.stateNode;
                    var Q = w.memoizedProps.style,
                      k =
                        Q != null && Q.hasOwnProperty("display")
                          ? Q.display
                          : null;
                    x.style.display =
                      k == null || typeof k == "boolean" ? "" : ("" + k).trim();
                  }
                } catch (ne) {
                  Me(w, w.return, ne);
                }
              }
            } else if (t.tag === 6) {
              if (n === null) {
                w = t;
                try {
                  w.stateNode.nodeValue = r ? "" : w.memoizedProps;
                } catch (ne) {
                  Me(w, w.return, ne);
                }
              }
            } else if (t.tag === 18) {
              if (n === null) {
                w = t;
                try {
                  var U = w.stateNode;
                  r ? zh(U, !0) : zh(w.stateNode, !1);
                } catch (ne) {
                  Me(w, w.return, ne);
                }
              }
            } else if (
              ((t.tag !== 22 && t.tag !== 23) ||
                t.memoizedState === null ||
                t === e) &&
              t.child !== null
            ) {
              ((t.child.return = t), (t = t.child));
              continue;
            }
            if (t === e) break e;
            for (; t.sibling === null; ) {
              if (t.return === null || t.return === e) break e;
              (n === t && (n = null), (t = t.return));
            }
            (n === t && (n = null),
              (t.sibling.return = t.return),
              (t = t.sibling));
          }
        l & 4 &&
          ((l = e.updateQueue),
          l !== null &&
            ((n = l.retryQueue),
            n !== null && ((l.retryQueue = null), Pr(e, n))));
        break;
      case 19:
        (kt(t, e),
          Ut(e),
          l & 4 &&
            ((l = e.updateQueue),
            l !== null && ((e.updateQueue = null), Pr(e, l))));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        (kt(t, e), Ut(e));
    }
  }
  function Ut(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null; ) {
          if (Dm(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        if (n == null) throw Error(o(160));
        switch (n.tag) {
          case 27:
            var r = n.stateNode,
              u = _u(e);
            Ir(e, u, r);
            break;
          case 5:
            var m = n.stateNode;
            n.flags & 32 && (gl(m, ""), (n.flags &= -33));
            var x = _u(e);
            Ir(e, x, m);
            break;
          case 3:
          case 4:
            var w = n.stateNode.containerInfo,
              O = _u(e);
            ju(e, O, w);
            break;
          default:
            throw Error(o(161));
        }
      } catch (G) {
        Me(e, e.return, G);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function qm(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        (qm(t),
          t.tag === 5 && t.flags & 1024 && t.stateNode.reset(),
          (e = e.sibling));
      }
  }
  function Hn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; ) (Um(e, t.alternate, t), (t = t.sibling));
  }
  function Ia(e) {
    for (e = e.child; e !== null; ) {
      var t = e;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (ma(4, t, t.return), Ia(t));
          break;
        case 1:
          bn(t, t.return);
          var n = t.stateNode;
          (typeof n.componentWillUnmount == "function" && zm(t, t.return, n),
            Ia(t));
          break;
        case 27:
          Zi(t.stateNode);
        case 26:
        case 5:
          (bn(t, t.return), Ia(t));
          break;
        case 22:
          t.memoizedState === null && Ia(t);
          break;
        case 30:
          Ia(t);
          break;
        default:
          Ia(t);
      }
      e = e.sibling;
    }
  }
  function Gn(e, t, n) {
    for (n = n && (t.subtreeFlags & 8772) !== 0, t = t.child; t !== null; ) {
      var l = t.alternate,
        r = e,
        u = t,
        m = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          (Gn(r, u, n), Ui(4, u));
          break;
        case 1:
          if (
            (Gn(r, u, n),
            (l = u),
            (r = l.stateNode),
            typeof r.componentDidMount == "function")
          )
            try {
              r.componentDidMount();
            } catch (O) {
              Me(l, l.return, O);
            }
          if (((l = u), (r = l.updateQueue), r !== null)) {
            var x = l.stateNode;
            try {
              var w = r.shared.hiddenCallbacks;
              if (w !== null)
                for (r.shared.hiddenCallbacks = null, r = 0; r < w.length; r++)
                  yd(w[r], x);
            } catch (O) {
              Me(l, l.return, O);
            }
          }
          (n && m & 64 && Rm(u), Li(u, u.return));
          break;
        case 27:
          Om(u);
        case 26:
        case 5:
          (Gn(r, u, n), n && l === null && m & 4 && Mm(u), Li(u, u.return));
          break;
        case 12:
          Gn(r, u, n);
          break;
        case 31:
          (Gn(r, u, n), n && m & 4 && Hm(r, u));
          break;
        case 13:
          (Gn(r, u, n), n && m & 4 && Gm(r, u));
          break;
        case 22:
          (u.memoizedState === null && Gn(r, u, n), Li(u, u.return));
          break;
        case 30:
          break;
        default:
          Gn(r, u, n);
      }
      t = t.sibling;
    }
  }
  function Cu(e, t) {
    var n = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (n = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== n && (e != null && e.refCount++, n != null && wi(n)));
  }
  function Au(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && wi(e)));
  }
  function dn(e, t, n, l) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) (Vm(e, t, n, l), (t = t.sibling));
  }
  function Vm(e, t, n, l) {
    var r = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (dn(e, t, n, l), r & 2048 && Ui(9, t));
        break;
      case 1:
        dn(e, t, n, l);
        break;
      case 3:
        (dn(e, t, n, l),
          r & 2048 &&
            ((e = null),
            t.alternate !== null && (e = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== e && (t.refCount++, e != null && wi(e))));
        break;
      case 12:
        if (r & 2048) {
          (dn(e, t, n, l), (e = t.stateNode));
          try {
            var u = t.memoizedProps,
              m = u.id,
              x = u.onPostCommit;
            typeof x == "function" &&
              x(
                m,
                t.alternate === null ? "mount" : "update",
                e.passiveEffectDuration,
                -0,
              );
          } catch (w) {
            Me(t, t.return, w);
          }
        } else dn(e, t, n, l);
        break;
      case 31:
        dn(e, t, n, l);
        break;
      case 13:
        dn(e, t, n, l);
        break;
      case 23:
        break;
      case 22:
        ((u = t.stateNode),
          (m = t.alternate),
          t.memoizedState !== null
            ? u._visibility & 2
              ? dn(e, t, n, l)
              : Bi(e, t)
            : u._visibility & 2
              ? dn(e, t, n, l)
              : ((u._visibility |= 2),
                kl(e, t, n, l, (t.subtreeFlags & 10256) !== 0 || !1)),
          r & 2048 && Cu(m, t));
        break;
      case 24:
        (dn(e, t, n, l), r & 2048 && Au(t.alternate, t));
        break;
      default:
        dn(e, t, n, l);
    }
  }
  function kl(e, t, n, l, r) {
    for (
      r = r && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child;
      t !== null;
    ) {
      var u = e,
        m = t,
        x = n,
        w = l,
        O = m.flags;
      switch (m.tag) {
        case 0:
        case 11:
        case 15:
          (kl(u, m, x, w, r), Ui(8, m));
          break;
        case 23:
          break;
        case 22:
          var G = m.stateNode;
          (m.memoizedState !== null
            ? G._visibility & 2
              ? kl(u, m, x, w, r)
              : Bi(u, m)
            : ((G._visibility |= 2), kl(u, m, x, w, r)),
            r && O & 2048 && Cu(m.alternate, m));
          break;
        case 24:
          (kl(u, m, x, w, r), r && O & 2048 && Au(m.alternate, m));
          break;
        default:
          kl(u, m, x, w, r);
      }
      t = t.sibling;
    }
  }
  function Bi(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var n = e,
          l = t,
          r = l.flags;
        switch (l.tag) {
          case 22:
            (Bi(n, l), r & 2048 && Cu(l.alternate, l));
            break;
          case 24:
            (Bi(n, l), r & 2048 && Au(l.alternate, l));
            break;
          default:
            Bi(n, l);
        }
        t = t.sibling;
      }
  }
  var Hi = 8192;
  function Ul(e, t, n) {
    if (e.subtreeFlags & Hi)
      for (e = e.child; e !== null; ) (Xm(e, t, n), (e = e.sibling));
  }
  function Xm(e, t, n) {
    switch (e.tag) {
      case 26:
        (Ul(e, t, n),
          e.flags & Hi &&
            e.memoizedState !== null &&
            n0(n, fn, e.memoizedState, e.memoizedProps));
        break;
      case 5:
        Ul(e, t, n);
        break;
      case 3:
      case 4:
        var l = fn;
        ((fn = ms(e.stateNode.containerInfo)), Ul(e, t, n), (fn = l));
        break;
      case 22:
        e.memoizedState === null &&
          ((l = e.alternate),
          l !== null && l.memoizedState !== null
            ? ((l = Hi), (Hi = 16777216), Ul(e, t, n), (Hi = l))
            : Ul(e, t, n));
        break;
      default:
        Ul(e, t, n);
    }
  }
  function Qm(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function Gi(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          ((ot = l), Km(l, e));
        }
      Qm(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) (Zm(e), (e = e.sibling));
  }
  function Zm(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Gi(e), e.flags & 2048 && ma(9, e, e.return));
        break;
      case 3:
        Gi(e);
        break;
      case 12:
        Gi(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null &&
        t._visibility & 2 &&
        (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), es(e))
          : Gi(e);
        break;
      default:
        Gi(e);
    }
  }
  function es(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          ((ot = l), Km(l, e));
        }
      Qm(e);
    }
    for (e = e.child; e !== null; ) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (ma(8, t, t.return), es(t));
          break;
        case 22:
          ((n = t.stateNode),
            n._visibility & 2 && ((n._visibility &= -3), es(t)));
          break;
        default:
          es(t);
      }
      e = e.sibling;
    }
  }
  function Km(e, t) {
    for (; ot !== null; ) {
      var n = ot;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ma(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          wi(n.memoizedState.cache);
      }
      if (((l = n.child), l !== null)) ((l.return = n), (ot = l));
      else
        e: for (n = e; ot !== null; ) {
          l = ot;
          var r = l.sibling,
            u = l.return;
          if ((Lm(l), l === n)) {
            ot = null;
            break e;
          }
          if (r !== null) {
            ((r.return = u), (ot = r));
            break e;
          }
          ot = u;
        }
    }
  }
  var vy = {
      getCacheForType: function (e) {
        var t = dt(Ie),
          n = t.data.get(e);
        return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
      },
      cacheSignal: function () {
        return dt(Ie).controller.signal;
      },
    },
    by = typeof WeakMap == "function" ? WeakMap : Map,
    Re = 0,
    Ue = null,
    xe = null,
    we = 0,
    ze = 0,
    Zt = null,
    ha = !1,
    Ll = !1,
    Ru = !1,
    Yn = 0,
    Ke = 0,
    ga = 0,
    Pa = 0,
    zu = 0,
    Kt = 0,
    Bl = 0,
    Yi = null,
    Lt = null,
    Mu = !1,
    ts = 0,
    Jm = 0,
    ns = 1 / 0,
    as = null,
    pa = null,
    lt = 0,
    va = null,
    Hl = null,
    qn = 0,
    Du = 0,
    Ou = null,
    $m = null,
    qi = 0,
    ku = null;
  function Jt() {
    return (Re & 2) !== 0 && we !== 0 ? we & -we : M.T !== null ? Yu() : eo();
  }
  function Fm() {
    if (Kt === 0)
      if ((we & 536870912) === 0 || Te) {
        var e = sl;
        ((sl <<= 1), (sl & 3932160) === 0 && (sl = 262144), (Kt = e));
      } else Kt = 536870912;
    return ((e = Xt.current), e !== null && (e.flags |= 32), Kt);
  }
  function Bt(e, t, n) {
    (((e === Ue && (ze === 2 || ze === 9)) || e.cancelPendingCommit !== null) &&
      (Gl(e, 0), ba(e, we, Kt, !1)),
      Ve(e, n),
      ((Re & 2) === 0 || e !== Ue) &&
        (e === Ue &&
          ((Re & 2) === 0 && (Pa |= n), Ke === 4 && ba(e, we, Kt, !1)),
        yn(e)));
  }
  function Wm(e, t, n) {
    if ((Re & 6) !== 0) throw Error(o(327));
    var l = (!n && (t & 127) === 0 && (t & e.expiredLanes) === 0) || Ge(e, t),
      r = l ? Sy(e, t) : Lu(e, t, !0),
      u = l;
    do {
      if (r === 0) {
        Ll && !l && ba(e, t, 0, !1);
        break;
      } else {
        if (((n = e.current.alternate), u && !yy(n))) {
          ((r = Lu(e, t, !1)), (u = !1));
          continue;
        }
        if (r === 2) {
          if (((u = t), e.errorRecoveryDisabledLanes & u)) var m = 0;
          else
            ((m = e.pendingLanes & -536870913),
              (m = m !== 0 ? m : m & 536870912 ? 536870912 : 0));
          if (m !== 0) {
            t = m;
            e: {
              var x = e;
              r = Yi;
              var w = x.current.memoizedState.isDehydrated;
              if ((w && (Gl(x, m).flags |= 256), (m = Lu(x, m, !1)), m !== 2)) {
                if (Ru && !w) {
                  ((x.errorRecoveryDisabledLanes |= u), (Pa |= u), (r = 4));
                  break e;
                }
                ((u = Lt),
                  (Lt = r),
                  u !== null &&
                    (Lt === null ? (Lt = u) : Lt.push.apply(Lt, u)));
              }
              r = m;
            }
            if (((u = !1), r !== 2)) continue;
          }
        }
        if (r === 1) {
          (Gl(e, 0), ba(e, t, 0, !0));
          break;
        }
        e: {
          switch (((l = e), (u = r), u)) {
            case 0:
            case 1:
              throw Error(o(345));
            case 4:
              if ((t & 4194048) !== t) break;
            case 6:
              ba(l, t, Kt, !ha);
              break e;
            case 2:
              Lt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(o(329));
          }
          if ((t & 62914560) === t && ((r = ts + 300 - _t()), 10 < r)) {
            if ((ba(l, t, Kt, !ha), ce(l, 0, !0) !== 0)) break e;
            ((qn = t),
              (l.timeoutHandle = Ch(
                Im.bind(
                  null,
                  l,
                  n,
                  Lt,
                  as,
                  Mu,
                  t,
                  Kt,
                  Pa,
                  Bl,
                  ha,
                  u,
                  "Throttled",
                  -0,
                  0,
                ),
                r,
              )));
            break e;
          }
          Im(l, n, Lt, as, Mu, t, Kt, Pa, Bl, ha, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    yn(e);
  }
  function Im(e, t, n, l, r, u, m, x, w, O, G, Q, k, U) {
    if (
      ((e.timeoutHandle = -1),
      (Q = t.subtreeFlags),
      Q & 8192 || (Q & 16785408) === 16785408)
    ) {
      ((Q = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: Tn,
      }),
        Xm(t, u, Q));
      var ne =
        (u & 62914560) === u ? ts - _t() : (u & 4194048) === u ? Jm - _t() : 0;
      if (((ne = a0(Q, ne)), ne !== null)) {
        ((qn = u),
          (e.cancelPendingCommit = ne(
            rh.bind(null, e, t, u, n, l, r, m, x, w, G, Q, null, k, U),
          )),
          ba(e, u, m, !O));
        return;
      }
    }
    rh(e, t, u, n, l, r, m, x, w);
  }
  function yy(e) {
    for (var t = e; ; ) {
      var n = t.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        t.flags & 16384 &&
        ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var l = 0; l < n.length; l++) {
          var r = n[l],
            u = r.getSnapshot;
          r = r.value;
          try {
            if (!qt(u(), r)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
        ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function ba(e, t, n, l) {
    ((t &= ~zu),
      (t &= ~Pa),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      l && (e.warmLanes |= t),
      (l = e.expirationTimes));
    for (var r = t; 0 < r; ) {
      var u = 31 - yt(r),
        m = 1 << u;
      ((l[u] = -1), (r &= ~m));
    }
    n !== 0 && Ua(e, n, t);
  }
  function ls() {
    return (Re & 6) === 0 ? (Vi(0), !1) : !0;
  }
  function Uu() {
    if (xe !== null) {
      if (ze === 0) var e = xe.return;
      else ((e = xe), (zn = Xa = null), Io(e), (Rl = null), (_i = 0), (e = xe));
      for (; e !== null; ) (Am(e.alternate, e), (e = e.return));
      xe = null;
    }
  }
  function Gl(e, t) {
    var n = e.timeoutHandle;
    (n !== -1 && ((e.timeoutHandle = -1), Hy(n)),
      (n = e.cancelPendingCommit),
      n !== null && ((e.cancelPendingCommit = null), n()),
      (qn = 0),
      Uu(),
      (Ue = e),
      (xe = n = An(e.current, null)),
      (we = t),
      (ze = 0),
      (Zt = null),
      (ha = !1),
      (Ll = Ge(e, t)),
      (Ru = !1),
      (Bl = Kt = zu = Pa = ga = Ke = 0),
      (Lt = Yi = null),
      (Mu = !1),
      (t & 8) !== 0 && (t |= t & 32));
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var r = 31 - yt(l),
          u = 1 << r;
        ((t |= e[r]), (l &= ~u));
      }
    return ((Yn = t), _r(), n);
  }
  function Pm(e, t) {
    ((he = null),
      (M.H = Di),
      t === Al || t === Dr
        ? ((t = gd()), (ze = 3))
        : t === Go
          ? ((t = gd()), (ze = 4))
          : (ze =
              t === hu
                ? 8
                : t !== null &&
                    typeof t == "object" &&
                    typeof t.then == "function"
                  ? 6
                  : 1),
      (Zt = t),
      xe === null && ((Ke = 1), Kr(e, Pt(t, e.current))));
  }
  function eh() {
    var e = Xt.current;
    return e === null
      ? !0
      : (we & 4194048) === we
        ? an === null
        : (we & 62914560) === we || (we & 536870912) !== 0
          ? e === an
          : !1;
  }
  function th() {
    var e = M.H;
    return ((M.H = Di), e === null ? Di : e);
  }
  function nh() {
    var e = M.A;
    return ((M.A = vy), e);
  }
  function is() {
    ((Ke = 4),
      ha || ((we & 4194048) !== we && Xt.current !== null) || (Ll = !0),
      ((ga & 134217727) === 0 && (Pa & 134217727) === 0) ||
        Ue === null ||
        ba(Ue, we, Kt, !1));
  }
  function Lu(e, t, n) {
    var l = Re;
    Re |= 2;
    var r = th(),
      u = nh();
    ((Ue !== e || we !== t) && ((as = null), Gl(e, t)), (t = !1));
    var m = Ke;
    e: do
      try {
        if (ze !== 0 && xe !== null) {
          var x = xe,
            w = Zt;
          switch (ze) {
            case 8:
              (Uu(), (m = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Xt.current === null && (t = !0);
              var O = ze;
              if (((ze = 0), (Zt = null), Yl(e, x, w, O), n && Ll)) {
                m = 0;
                break e;
              }
              break;
            default:
              ((O = ze), (ze = 0), (Zt = null), Yl(e, x, w, O));
          }
        }
        (xy(), (m = Ke));
        break;
      } catch (G) {
        Pm(e, G);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (zn = Xa = null),
      (Re = l),
      (M.H = r),
      (M.A = u),
      xe === null && ((Ue = null), (we = 0), _r()),
      m
    );
  }
  function xy() {
    for (; xe !== null; ) ah(xe);
  }
  function Sy(e, t) {
    var n = Re;
    Re |= 2;
    var l = th(),
      r = nh();
    Ue !== e || we !== t
      ? ((as = null), (ns = _t() + 500), Gl(e, t))
      : (Ll = Ge(e, t));
    e: do
      try {
        if (ze !== 0 && xe !== null) {
          t = xe;
          var u = Zt;
          t: switch (ze) {
            case 1:
              ((ze = 0), (Zt = null), Yl(e, t, u, 1));
              break;
            case 2:
            case 9:
              if (md(u)) {
                ((ze = 0), (Zt = null), lh(t));
                break;
              }
              ((t = function () {
                ((ze !== 2 && ze !== 9) || Ue !== e || (ze = 7), yn(e));
              }),
                u.then(t, t));
              break e;
            case 3:
              ze = 7;
              break e;
            case 4:
              ze = 5;
              break e;
            case 7:
              md(u)
                ? ((ze = 0), (Zt = null), lh(t))
                : ((ze = 0), (Zt = null), Yl(e, t, u, 7));
              break;
            case 5:
              var m = null;
              switch (xe.tag) {
                case 26:
                  m = xe.memoizedState;
                case 5:
                case 27:
                  var x = xe;
                  if (m ? Vh(m) : x.stateNode.complete) {
                    ((ze = 0), (Zt = null));
                    var w = x.sibling;
                    if (w !== null) xe = w;
                    else {
                      var O = x.return;
                      O !== null ? ((xe = O), rs(O)) : (xe = null);
                    }
                    break t;
                  }
              }
              ((ze = 0), (Zt = null), Yl(e, t, u, 5));
              break;
            case 6:
              ((ze = 0), (Zt = null), Yl(e, t, u, 6));
              break;
            case 8:
              (Uu(), (Ke = 6));
              break e;
            default:
              throw Error(o(462));
          }
        }
        Ey();
        break;
      } catch (G) {
        Pm(e, G);
      }
    while (!0);
    return (
      (zn = Xa = null),
      (M.H = l),
      (M.A = r),
      (Re = n),
      xe !== null ? 0 : ((Ue = null), (we = 0), _r(), Ke)
    );
  }
  function Ey() {
    for (; xe !== null && !Nt(); ) ah(xe);
  }
  function ah(e) {
    var t = Tm(e.alternate, e, Yn);
    ((e.memoizedProps = e.pendingProps), t === null ? rs(e) : (xe = t));
  }
  function lh(e) {
    var t = e,
      n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Sm(n, t, t.pendingProps, t.type, void 0, we);
        break;
      case 11:
        t = Sm(n, t, t.pendingProps, t.type.render, t.ref, we);
        break;
      case 5:
        Io(t);
      default:
        (Am(n, t), (t = xe = nd(t, Yn)), (t = Tm(n, t, Yn)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? rs(e) : (xe = t));
  }
  function Yl(e, t, n, l) {
    ((zn = Xa = null), Io(t), (Rl = null), (_i = 0));
    var r = t.return;
    try {
      if (cy(e, r, t, n, we)) {
        ((Ke = 1), Kr(e, Pt(n, e.current)), (xe = null));
        return;
      }
    } catch (u) {
      if (r !== null) throw ((xe = r), u);
      ((Ke = 1), Kr(e, Pt(n, e.current)), (xe = null));
      return;
    }
    t.flags & 32768
      ? (Te || l === 1
          ? (e = !0)
          : Ll || (we & 536870912) !== 0
            ? (e = !1)
            : ((ha = e = !0),
              (l === 2 || l === 9 || l === 3 || l === 6) &&
                ((l = Xt.current),
                l !== null && l.tag === 13 && (l.flags |= 16384))),
        ih(t, e))
      : rs(t);
  }
  function rs(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        ih(t, ha);
        return;
      }
      e = t.return;
      var n = my(t.alternate, t, Yn);
      if (n !== null) {
        xe = n;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        xe = t;
        return;
      }
      xe = t = e;
    } while (t !== null);
    Ke === 0 && (Ke = 5);
  }
  function ih(e, t) {
    do {
      var n = hy(e.alternate, e);
      if (n !== null) {
        ((n.flags &= 32767), (xe = n));
        return;
      }
      if (
        ((n = e.return),
        n !== null &&
          ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        xe = e;
        return;
      }
      xe = e = n;
    } while (e !== null);
    ((Ke = 6), (xe = null));
  }
  function rh(e, t, n, l, r, u, m, x, w) {
    e.cancelPendingCommit = null;
    do ss();
    while (lt !== 0);
    if ((Re & 6) !== 0) throw Error(o(327));
    if (t !== null) {
      if (t === e.current) throw Error(o(177));
      if (
        ((u = t.lanes | t.childLanes),
        (u |= _o),
        At(e, n, u, m, x, w),
        e === Ue && ((xe = Ue = null), (we = 0)),
        (Hl = t),
        (va = e),
        (qn = n),
        (Du = u),
        (Ou = r),
        ($m = l),
        (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
          ? ((e.callbackNode = null),
            (e.callbackPriority = 0),
            jy(Da, function () {
              return (fh(), null);
            }))
          : ((e.callbackNode = null), (e.callbackPriority = 0)),
        (l = (t.flags & 13878) !== 0),
        (t.subtreeFlags & 13878) !== 0 || l)
      ) {
        ((l = M.T), (M.T = null), (r = K.p), (K.p = 2), (m = Re), (Re |= 4));
        try {
          gy(e, t, n);
        } finally {
          ((Re = m), (K.p = r), (M.T = l));
        }
      }
      ((lt = 1), sh(), oh(), uh());
    }
  }
  function sh() {
    if (lt === 1) {
      lt = 0;
      var e = va,
        t = Hl,
        n = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || n) {
        ((n = M.T), (M.T = null));
        var l = K.p;
        K.p = 2;
        var r = Re;
        Re |= 4;
        try {
          Ym(t, e);
          var u = $u,
            m = Kf(e.containerInfo),
            x = u.focusedElem,
            w = u.selectionRange;
          if (
            m !== x &&
            x &&
            x.ownerDocument &&
            Zf(x.ownerDocument.documentElement, x)
          ) {
            if (w !== null && xo(x)) {
              var O = w.start,
                G = w.end;
              if ((G === void 0 && (G = O), "selectionStart" in x))
                ((x.selectionStart = O),
                  (x.selectionEnd = Math.min(G, x.value.length)));
              else {
                var Q = x.ownerDocument || document,
                  k = (Q && Q.defaultView) || window;
                if (k.getSelection) {
                  var U = k.getSelection(),
                    ne = x.textContent.length,
                    oe = Math.min(w.start, ne),
                    ke = w.end === void 0 ? oe : Math.min(w.end, ne);
                  !U.extend && oe > ke && ((m = ke), (ke = oe), (oe = m));
                  var R = Qf(x, oe),
                    T = Qf(x, ke);
                  if (
                    R &&
                    T &&
                    (U.rangeCount !== 1 ||
                      U.anchorNode !== R.node ||
                      U.anchorOffset !== R.offset ||
                      U.focusNode !== T.node ||
                      U.focusOffset !== T.offset)
                  ) {
                    var D = Q.createRange();
                    (D.setStart(R.node, R.offset),
                      U.removeAllRanges(),
                      oe > ke
                        ? (U.addRange(D), U.extend(T.node, T.offset))
                        : (D.setEnd(T.node, T.offset), U.addRange(D)));
                  }
                }
              }
            }
            for (Q = [], U = x; (U = U.parentNode); )
              U.nodeType === 1 &&
                Q.push({ element: U, left: U.scrollLeft, top: U.scrollTop });
            for (
              typeof x.focus == "function" && x.focus(), x = 0;
              x < Q.length;
              x++
            ) {
              var V = Q[x];
              ((V.element.scrollLeft = V.left), (V.element.scrollTop = V.top));
            }
          }
          ((ys = !!Ju), ($u = Ju = null));
        } finally {
          ((Re = r), (K.p = l), (M.T = n));
        }
      }
      ((e.current = t), (lt = 2));
    }
  }
  function oh() {
    if (lt === 2) {
      lt = 0;
      var e = va,
        t = Hl,
        n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        ((n = M.T), (M.T = null));
        var l = K.p;
        K.p = 2;
        var r = Re;
        Re |= 4;
        try {
          Um(e, t.alternate, t);
        } finally {
          ((Re = r), (K.p = l), (M.T = n));
        }
      }
      lt = 3;
    }
  }
  function uh() {
    if (lt === 4 || lt === 3) {
      ((lt = 0), Pn());
      var e = va,
        t = Hl,
        n = qn,
        l = $m;
      (t.subtreeFlags & 10256) !== 0 || (t.flags & 10256) !== 0
        ? (lt = 5)
        : ((lt = 0), (Hl = va = null), ch(e, e.pendingLanes));
      var r = e.pendingLanes;
      if (
        (r === 0 && (pa = null),
        un(n),
        (t = t.stateNode),
        jt && typeof jt.onCommitFiberRoot == "function")
      )
        try {
          jt.onCommitFiberRoot(Oa, t, void 0, (t.current.flags & 128) === 128);
        } catch {}
      if (l !== null) {
        ((t = M.T), (r = K.p), (K.p = 2), (M.T = null));
        try {
          for (var u = e.onRecoverableError, m = 0; m < l.length; m++) {
            var x = l[m];
            u(x.value, { componentStack: x.stack });
          }
        } finally {
          ((M.T = t), (K.p = r));
        }
      }
      ((qn & 3) !== 0 && ss(),
        yn(e),
        (r = e.pendingLanes),
        (n & 261930) !== 0 && (r & 42) !== 0
          ? e === ku
            ? qi++
            : ((qi = 0), (ku = e))
          : (qi = 0),
        Vi(0));
    }
  }
  function ch(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), wi(t)));
  }
  function ss() {
    return (sh(), oh(), uh(), fh());
  }
  function fh() {
    if (lt !== 5) return !1;
    var e = va,
      t = Du;
    Du = 0;
    var n = un(qn),
      l = M.T,
      r = K.p;
    try {
      ((K.p = 32 > n ? 32 : n), (M.T = null), (n = Ou), (Ou = null));
      var u = va,
        m = qn;
      if (((lt = 0), (Hl = va = null), (qn = 0), (Re & 6) !== 0))
        throw Error(o(331));
      var x = Re;
      if (
        ((Re |= 4),
        Zm(u.current),
        Vm(u, u.current, m, n),
        (Re = x),
        Vi(0, !1),
        jt && typeof jt.onPostCommitFiberRoot == "function")
      )
        try {
          jt.onPostCommitFiberRoot(Oa, u);
        } catch {}
      return !0;
    } finally {
      ((K.p = r), (M.T = l), ch(e, t));
    }
  }
  function dh(e, t, n) {
    ((t = Pt(n, t)),
      (t = mu(e.stateNode, t, 2)),
      (e = ca(e, t, 2)),
      e !== null && (Ve(e, 2), yn(e)));
  }
  function Me(e, t, n) {
    if (e.tag === 3) dh(e, e, n);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          dh(t, e, n);
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == "function" ||
            (typeof l.componentDidCatch == "function" &&
              (pa === null || !pa.has(l)))
          ) {
            ((e = Pt(n, e)),
              (n = mm(2)),
              (l = ca(t, n, 2)),
              l !== null && (hm(n, l, t, e), Ve(l, 2), yn(l)));
            break;
          }
        }
        t = t.return;
      }
  }
  function Bu(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new by();
      var r = new Set();
      l.set(t, r);
    } else ((r = l.get(t)), r === void 0 && ((r = new Set()), l.set(t, r)));
    r.has(n) ||
      ((Ru = !0), r.add(n), (e = wy.bind(null, e, t, n)), t.then(e, e));
  }
  function wy(e, t, n) {
    var l = e.pingCache;
    (l !== null && l.delete(t),
      (e.pingedLanes |= e.suspendedLanes & n),
      (e.warmLanes &= ~n),
      Ue === e &&
        (we & n) === n &&
        (Ke === 4 || (Ke === 3 && (we & 62914560) === we && 300 > _t() - ts)
          ? (Re & 2) === 0 && Gl(e, 0)
          : (zu |= n),
        Bl === we && (Bl = 0)),
      yn(e));
  }
  function mh(e, t) {
    (t === 0 && (t = xt()), (e = Ya(e, t)), e !== null && (Ve(e, t), yn(e)));
  }
  function Ny(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), mh(e, n));
  }
  function _y(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode,
          r = e.memoizedState;
        r !== null && (n = r.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(o(314));
    }
    (l !== null && l.delete(t), mh(e, n));
  }
  function jy(e, t) {
    return ri(e, t);
  }
  var os = null,
    ql = null,
    Hu = !1,
    us = !1,
    Gu = !1,
    ya = 0;
  function yn(e) {
    (e !== ql &&
      e.next === null &&
      (ql === null ? (os = ql = e) : (ql = ql.next = e)),
      (us = !0),
      Hu || ((Hu = !0), Cy()));
  }
  function Vi(e, t) {
    if (!Gu && us) {
      Gu = !0;
      do
        for (var n = !1, l = os; l !== null; ) {
          if (e !== 0) {
            var r = l.pendingLanes;
            if (r === 0) var u = 0;
            else {
              var m = l.suspendedLanes,
                x = l.pingedLanes;
              ((u = (1 << (31 - yt(42 | e) + 1)) - 1),
                (u &= r & ~(m & ~x)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0));
            }
            u !== 0 && ((n = !0), vh(l, u));
          } else
            ((u = we),
              (u = ce(
                l,
                l === Ue ? u : 0,
                l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
              )),
              (u & 3) === 0 || Ge(l, u) || ((n = !0), vh(l, u)));
          l = l.next;
        }
      while (n);
      Gu = !1;
    }
  }
  function Ty() {
    hh();
  }
  function hh() {
    us = Hu = !1;
    var e = 0;
    ya !== 0 && By() && (e = ya);
    for (var t = _t(), n = null, l = os; l !== null; ) {
      var r = l.next,
        u = gh(l, t);
      (u === 0
        ? ((l.next = null),
          n === null ? (os = r) : (n.next = r),
          r === null && (ql = n))
        : ((n = l), (e !== 0 || (u & 3) !== 0) && (us = !0)),
        (l = r));
    }
    ((lt !== 0 && lt !== 5) || Vi(e), ya !== 0 && (ya = 0));
  }
  function gh(e, t) {
    for (
      var n = e.suspendedLanes,
        l = e.pingedLanes,
        r = e.expirationTimes,
        u = e.pendingLanes & -62914561;
      0 < u;
    ) {
      var m = 31 - yt(u),
        x = 1 << m,
        w = r[m];
      (w === -1
        ? ((x & n) === 0 || (x & l) !== 0) && (r[m] = rt(x, t))
        : w <= t && (e.expiredLanes |= x),
        (u &= ~x));
    }
    if (
      ((t = Ue),
      (n = we),
      (n = ce(
        e,
        e === t ? n : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
      )),
      (l = e.callbackNode),
      n === 0 ||
        (e === t && (ze === 2 || ze === 9)) ||
        e.cancelPendingCommit !== null)
    )
      return (
        l !== null && l !== null && si(l),
        (e.callbackNode = null),
        (e.callbackPriority = 0)
      );
    if ((n & 3) === 0 || Ge(e, n)) {
      if (((t = n & -n), t === e.callbackPriority)) return t;
      switch ((l !== null && si(l), un(n))) {
        case 2:
        case 8:
          n = dr;
          break;
        case 32:
          n = Da;
          break;
        case 268435456:
          n = _n;
          break;
        default:
          n = Da;
      }
      return (
        (l = ph.bind(null, e)),
        (n = ri(n, l)),
        (e.callbackPriority = t),
        (e.callbackNode = n),
        t
      );
    }
    return (
      l !== null && l !== null && si(l),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function ph(e, t) {
    if (lt !== 0 && lt !== 5)
      return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var n = e.callbackNode;
    if (ss() && e.callbackNode !== n) return null;
    var l = we;
    return (
      (l = ce(
        e,
        e === Ue ? l : 0,
        e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
      )),
      l === 0
        ? null
        : (Wm(e, l, t),
          gh(e, _t()),
          e.callbackNode != null && e.callbackNode === n
            ? ph.bind(null, e)
            : null)
    );
  }
  function vh(e, t) {
    if (ss()) return null;
    Wm(e, t, !0);
  }
  function Cy() {
    Gy(function () {
      (Re & 6) !== 0 ? ri(Ma, Ty) : hh();
    });
  }
  function Yu() {
    if (ya === 0) {
      var e = Tl;
      (e === 0 && ((e = rl), (rl <<= 1), (rl & 261888) === 0 && (rl = 256)),
        (ya = e));
    }
    return ya;
  }
  function bh(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean"
      ? null
      : typeof e == "function"
        ? e
        : vr("" + e);
  }
  function yh(e, t) {
    var n = t.ownerDocument.createElement("input");
    return (
      (n.name = t.name),
      (n.value = t.value),
      e.id && n.setAttribute("form", e.id),
      t.parentNode.insertBefore(n, t),
      (e = new FormData(e)),
      n.parentNode.removeChild(n),
      e
    );
  }
  function Ay(e, t, n, l, r) {
    if (t === "submit" && n && n.stateNode === r) {
      var u = bh((r[Mt] || null).action),
        m = l.submitter;
      m &&
        ((t = (t = m[Mt] || null)
          ? bh(t.formAction)
          : m.getAttribute("formAction")),
        t !== null && ((u = t), (m = null)));
      var x = new Sr("action", "action", null, l, r);
      e.push({
        event: x,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (l.defaultPrevented) {
                if (ya !== 0) {
                  var w = m ? yh(r, m) : new FormData(r);
                  su(
                    n,
                    { pending: !0, data: w, method: r.method, action: u },
                    null,
                    w,
                  );
                }
              } else
                typeof u == "function" &&
                  (x.preventDefault(),
                  (w = m ? yh(r, m) : new FormData(r)),
                  su(
                    n,
                    { pending: !0, data: w, method: r.method, action: u },
                    u,
                    w,
                  ));
            },
            currentTarget: r,
          },
        ],
      });
    }
  }
  for (var qu = 0; qu < No.length; qu++) {
    var Vu = No[qu],
      Ry = Vu.toLowerCase(),
      zy = Vu[0].toUpperCase() + Vu.slice(1);
    cn(Ry, "on" + zy);
  }
  (cn(Ff, "onAnimationEnd"),
    cn(Wf, "onAnimationIteration"),
    cn(If, "onAnimationStart"),
    cn("dblclick", "onDoubleClick"),
    cn("focusin", "onFocus"),
    cn("focusout", "onBlur"),
    cn(Kb, "onTransitionRun"),
    cn(Jb, "onTransitionStart"),
    cn($b, "onTransitionCancel"),
    cn(Pf, "onTransitionEnd"),
    ml("onMouseEnter", ["mouseout", "mouseover"]),
    ml("onMouseLeave", ["mouseout", "mouseover"]),
    ml("onPointerEnter", ["pointerout", "pointerover"]),
    ml("onPointerLeave", ["pointerout", "pointerover"]),
    La(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " ",
      ),
    ),
    La(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " ",
      ),
    ),
    La("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    La(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" "),
    ),
    La(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" "),
    ),
    La(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
    ));
  var Xi =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " ",
      ),
    My = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(Xi),
    );
  function xh(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n],
        r = l.event;
      l = l.listeners;
      e: {
        var u = void 0;
        if (t)
          for (var m = l.length - 1; 0 <= m; m--) {
            var x = l[m],
              w = x.instance,
              O = x.currentTarget;
            if (((x = x.listener), w !== u && r.isPropagationStopped()))
              break e;
            ((u = x), (r.currentTarget = O));
            try {
              u(r);
            } catch (G) {
              Nr(G);
            }
            ((r.currentTarget = null), (u = w));
          }
        else
          for (m = 0; m < l.length; m++) {
            if (
              ((x = l[m]),
              (w = x.instance),
              (O = x.currentTarget),
              (x = x.listener),
              w !== u && r.isPropagationStopped())
            )
              break e;
            ((u = x), (r.currentTarget = O));
            try {
              u(r);
            } catch (G) {
              Nr(G);
            }
            ((r.currentTarget = null), (u = w));
          }
      }
    }
  }
  function Se(e, t) {
    var n = t[to];
    n === void 0 && (n = t[to] = new Set());
    var l = e + "__bubble";
    n.has(l) || (Sh(t, e, 2, !1), n.add(l));
  }
  function Xu(e, t, n) {
    var l = 0;
    (t && (l |= 4), Sh(n, e, l, t));
  }
  var cs = "_reactListening" + Math.random().toString(36).slice(2);
  function Qu(e) {
    if (!e[cs]) {
      ((e[cs] = !0),
        hf.forEach(function (n) {
          n !== "selectionchange" && (My.has(n) || Xu(n, !1, e), Xu(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[cs] || ((t[cs] = !0), Xu("selectionchange", !1, t));
    }
  }
  function Sh(e, t, n, l) {
    switch (Fh(t)) {
      case 2:
        var r = r0;
        break;
      case 8:
        r = s0;
        break;
      default:
        r = rc;
    }
    ((n = r.bind(null, t, n, e)),
      (r = void 0),
      !co ||
        (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
        (r = !0),
      l
        ? r !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: r })
          : e.addEventListener(t, n, !0)
        : r !== void 0
          ? e.addEventListener(t, n, { passive: r })
          : e.addEventListener(t, n, !1));
  }
  function Zu(e, t, n, l, r) {
    var u = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (;;) {
        if (l === null) return;
        var m = l.tag;
        if (m === 3 || m === 4) {
          var x = l.stateNode.containerInfo;
          if (x === r) break;
          if (m === 4)
            for (m = l.return; m !== null; ) {
              var w = m.tag;
              if ((w === 3 || w === 4) && m.stateNode.containerInfo === r)
                return;
              m = m.return;
            }
          for (; x !== null; ) {
            if (((m = cl(x)), m === null)) return;
            if (((w = m.tag), w === 5 || w === 6 || w === 26 || w === 27)) {
              l = u = m;
              continue e;
            }
            x = x.parentNode;
          }
        }
        l = l.return;
      }
    jf(function () {
      var O = u,
        G = oo(n),
        Q = [];
      e: {
        var k = ed.get(e);
        if (k !== void 0) {
          var U = Sr,
            ne = e;
          switch (e) {
            case "keypress":
              if (yr(n) === 0) break e;
            case "keydown":
            case "keyup":
              U = _b;
              break;
            case "focusin":
              ((ne = "focus"), (U = go));
              break;
            case "focusout":
              ((ne = "blur"), (U = go));
              break;
            case "beforeblur":
            case "afterblur":
              U = go;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              U = Af;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              U = mb;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              U = Cb;
              break;
            case Ff:
            case Wf:
            case If:
              U = pb;
              break;
            case Pf:
              U = Rb;
              break;
            case "scroll":
            case "scrollend":
              U = fb;
              break;
            case "wheel":
              U = Mb;
              break;
            case "copy":
            case "cut":
            case "paste":
              U = bb;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              U = zf;
              break;
            case "toggle":
            case "beforetoggle":
              U = Ob;
          }
          var oe = (t & 4) !== 0,
            ke = !oe && (e === "scroll" || e === "scrollend"),
            R = oe ? (k !== null ? k + "Capture" : null) : k;
          oe = [];
          for (var T = O, D; T !== null; ) {
            var V = T;
            if (
              ((D = V.stateNode),
              (V = V.tag),
              (V !== 5 && V !== 26 && V !== 27) ||
                D === null ||
                R === null ||
                ((V = di(T, R)), V != null && oe.push(Qi(T, V, D))),
              ke)
            )
              break;
            T = T.return;
          }
          0 < oe.length &&
            ((k = new U(k, ne, null, n, G)),
            Q.push({ event: k, listeners: oe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((k = e === "mouseover" || e === "pointerover"),
            (U = e === "mouseout" || e === "pointerout"),
            k &&
              n !== so &&
              (ne = n.relatedTarget || n.fromElement) &&
              (cl(ne) || ne[ul]))
          )
            break e;
          if (
            (U || k) &&
            ((k =
              G.window === G
                ? G
                : (k = G.ownerDocument)
                  ? k.defaultView || k.parentWindow
                  : window),
            U
              ? ((ne = n.relatedTarget || n.toElement),
                (U = O),
                (ne = ne ? cl(ne) : null),
                ne !== null &&
                  ((ke = d(ne)),
                  (oe = ne.tag),
                  ne !== ke || (oe !== 5 && oe !== 27 && oe !== 6)) &&
                  (ne = null))
              : ((U = null), (ne = O)),
            U !== ne)
          ) {
            if (
              ((oe = Af),
              (V = "onMouseLeave"),
              (R = "onMouseEnter"),
              (T = "mouse"),
              (e === "pointerout" || e === "pointerover") &&
                ((oe = zf),
                (V = "onPointerLeave"),
                (R = "onPointerEnter"),
                (T = "pointer")),
              (ke = U == null ? k : fi(U)),
              (D = ne == null ? k : fi(ne)),
              (k = new oe(V, T + "leave", U, n, G)),
              (k.target = ke),
              (k.relatedTarget = D),
              (V = null),
              cl(G) === O &&
                ((oe = new oe(R, T + "enter", ne, n, G)),
                (oe.target = D),
                (oe.relatedTarget = ke),
                (V = oe)),
              (ke = V),
              U && ne)
            )
              t: {
                for (oe = Dy, R = U, T = ne, D = 0, V = R; V; V = oe(V)) D++;
                V = 0;
                for (var se = T; se; se = oe(se)) V++;
                for (; 0 < D - V; ) ((R = oe(R)), D--);
                for (; 0 < V - D; ) ((T = oe(T)), V--);
                for (; D--; ) {
                  if (R === T || (T !== null && R === T.alternate)) {
                    oe = R;
                    break t;
                  }
                  ((R = oe(R)), (T = oe(T)));
                }
                oe = null;
              }
            else oe = null;
            (U !== null && Eh(Q, k, U, oe, !1),
              ne !== null && ke !== null && Eh(Q, ke, ne, oe, !0));
          }
        }
        e: {
          if (
            ((k = O ? fi(O) : window),
            (U = k.nodeName && k.nodeName.toLowerCase()),
            U === "select" || (U === "input" && k.type === "file"))
          )
            var Ce = Hf;
          else if (Lf(k))
            if (Gf) Ce = Xb;
            else {
              Ce = qb;
              var re = Yb;
            }
          else
            ((U = k.nodeName),
              !U ||
              U.toLowerCase() !== "input" ||
              (k.type !== "checkbox" && k.type !== "radio")
                ? O && ro(O.elementType) && (Ce = Hf)
                : (Ce = Vb));
          if (Ce && (Ce = Ce(e, O))) {
            Bf(Q, Ce, n, G);
            break e;
          }
          (re && re(e, k, O),
            e === "focusout" &&
              O &&
              k.type === "number" &&
              O.memoizedProps.value != null &&
              io(k, "number", k.value));
        }
        switch (((re = O ? fi(O) : window), e)) {
          case "focusin":
            (Lf(re) || re.contentEditable === "true") &&
              ((yl = re), (So = O), (xi = null));
            break;
          case "focusout":
            xi = So = yl = null;
            break;
          case "mousedown":
            Eo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            ((Eo = !1), Jf(Q, n, G));
            break;
          case "selectionchange":
            if (Zb) break;
          case "keydown":
          case "keyup":
            Jf(Q, n, G);
        }
        var ge;
        if (vo)
          e: {
            switch (e) {
              case "compositionstart":
                var Ne = "onCompositionStart";
                break e;
              case "compositionend":
                Ne = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ne = "onCompositionUpdate";
                break e;
            }
            Ne = void 0;
          }
        else
          bl
            ? kf(e, n) && (Ne = "onCompositionEnd")
            : e === "keydown" &&
              n.keyCode === 229 &&
              (Ne = "onCompositionStart");
        (Ne &&
          (Mf &&
            n.locale !== "ko" &&
            (bl || Ne !== "onCompositionStart"
              ? Ne === "onCompositionEnd" && bl && (ge = Tf())
              : ((aa = G),
                (fo = "value" in aa ? aa.value : aa.textContent),
                (bl = !0))),
          (re = fs(O, Ne)),
          0 < re.length &&
            ((Ne = new Rf(Ne, e, null, n, G)),
            Q.push({ event: Ne, listeners: re }),
            ge
              ? (Ne.data = ge)
              : ((ge = Uf(n)), ge !== null && (Ne.data = ge)))),
          (ge = Ub ? Lb(e, n) : Bb(e, n)) &&
            ((Ne = fs(O, "onBeforeInput")),
            0 < Ne.length &&
              ((re = new Rf("onBeforeInput", "beforeinput", null, n, G)),
              Q.push({ event: re, listeners: Ne }),
              (re.data = ge))),
          Ay(Q, e, O, n, G));
      }
      xh(Q, t);
    });
  }
  function Qi(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function fs(e, t) {
    for (var n = t + "Capture", l = []; e !== null; ) {
      var r = e,
        u = r.stateNode;
      if (
        ((r = r.tag),
        (r !== 5 && r !== 26 && r !== 27) ||
          u === null ||
          ((r = di(e, n)),
          r != null && l.unshift(Qi(e, r, u)),
          (r = di(e, t)),
          r != null && l.push(Qi(e, r, u))),
        e.tag === 3)
      )
        return l;
      e = e.return;
    }
    return [];
  }
  function Dy(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Eh(e, t, n, l, r) {
    for (var u = t._reactName, m = []; n !== null && n !== l; ) {
      var x = n,
        w = x.alternate,
        O = x.stateNode;
      if (((x = x.tag), w !== null && w === l)) break;
      ((x !== 5 && x !== 26 && x !== 27) ||
        O === null ||
        ((w = O),
        r
          ? ((O = di(n, u)), O != null && m.unshift(Qi(n, O, w)))
          : r || ((O = di(n, u)), O != null && m.push(Qi(n, O, w)))),
        (n = n.return));
    }
    m.length !== 0 && e.push({ event: t, listeners: m });
  }
  var Oy = /\r\n?/g,
    ky = /\u0000|\uFFFD/g;
  function wh(e) {
    return (typeof e == "string" ? e : "" + e)
      .replace(
        Oy,
        `
`,
      )
      .replace(ky, "");
  }
  function Nh(e, t) {
    return ((t = wh(t)), wh(e) === t);
  }
  function Oe(e, t, n, l, r, u) {
    switch (n) {
      case "children":
        typeof l == "string"
          ? t === "body" || (t === "textarea" && l === "") || gl(e, l)
          : (typeof l == "number" || typeof l == "bigint") &&
            t !== "body" &&
            gl(e, "" + l);
        break;
      case "className":
        gr(e, "class", l);
        break;
      case "tabIndex":
        gr(e, "tabindex", l);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        gr(e, n, l);
        break;
      case "style":
        Nf(e, l, u);
        break;
      case "data":
        if (t !== "object") {
          gr(e, "data", l);
          break;
        }
      case "src":
      case "href":
        if (l === "" && (t !== "a" || n !== "href")) {
          e.removeAttribute(n);
          break;
        }
        if (
          l == null ||
          typeof l == "function" ||
          typeof l == "symbol" ||
          typeof l == "boolean"
        ) {
          e.removeAttribute(n);
          break;
        }
        ((l = vr("" + l)), e.setAttribute(n, l));
        break;
      case "action":
      case "formAction":
        if (typeof l == "function") {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof u == "function" &&
            (n === "formAction"
              ? (t !== "input" && Oe(e, t, "name", r.name, r, null),
                Oe(e, t, "formEncType", r.formEncType, r, null),
                Oe(e, t, "formMethod", r.formMethod, r, null),
                Oe(e, t, "formTarget", r.formTarget, r, null))
              : (Oe(e, t, "encType", r.encType, r, null),
                Oe(e, t, "method", r.method, r, null),
                Oe(e, t, "target", r.target, r, null)));
        if (l == null || typeof l == "symbol" || typeof l == "boolean") {
          e.removeAttribute(n);
          break;
        }
        ((l = vr("" + l)), e.setAttribute(n, l));
        break;
      case "onClick":
        l != null && (e.onclick = Tn);
        break;
      case "onScroll":
        l != null && Se("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Se("scrollend", e);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(o(61));
          if (((n = l.__html), n != null)) {
            if (r.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "multiple":
        e.multiple = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "muted":
        e.muted = l && typeof l != "function" && typeof l != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          l == null ||
          typeof l == "function" ||
          typeof l == "boolean" ||
          typeof l == "symbol"
        ) {
          e.removeAttribute("xlink:href");
          break;
        }
        ((n = vr("" + l)),
          e.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n));
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        l != null && typeof l != "function" && typeof l != "symbol"
          ? e.setAttribute(n, "" + l)
          : e.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        l && typeof l != "function" && typeof l != "symbol"
          ? e.setAttribute(n, "")
          : e.removeAttribute(n);
        break;
      case "capture":
      case "download":
        l === !0
          ? e.setAttribute(n, "")
          : l !== !1 &&
              l != null &&
              typeof l != "function" &&
              typeof l != "symbol"
            ? e.setAttribute(n, l)
            : e.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        l != null &&
        typeof l != "function" &&
        typeof l != "symbol" &&
        !isNaN(l) &&
        1 <= l
          ? e.setAttribute(n, l)
          : e.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        l == null || typeof l == "function" || typeof l == "symbol" || isNaN(l)
          ? e.removeAttribute(n)
          : e.setAttribute(n, l);
        break;
      case "popover":
        (Se("beforetoggle", e), Se("toggle", e), hr(e, "popover", l));
        break;
      case "xlinkActuate":
        jn(e, "http://www.w3.org/1999/xlink", "xlink:actuate", l);
        break;
      case "xlinkArcrole":
        jn(e, "http://www.w3.org/1999/xlink", "xlink:arcrole", l);
        break;
      case "xlinkRole":
        jn(e, "http://www.w3.org/1999/xlink", "xlink:role", l);
        break;
      case "xlinkShow":
        jn(e, "http://www.w3.org/1999/xlink", "xlink:show", l);
        break;
      case "xlinkTitle":
        jn(e, "http://www.w3.org/1999/xlink", "xlink:title", l);
        break;
      case "xlinkType":
        jn(e, "http://www.w3.org/1999/xlink", "xlink:type", l);
        break;
      case "xmlBase":
        jn(e, "http://www.w3.org/XML/1998/namespace", "xml:base", l);
        break;
      case "xmlLang":
        jn(e, "http://www.w3.org/XML/1998/namespace", "xml:lang", l);
        break;
      case "xmlSpace":
        jn(e, "http://www.w3.org/XML/1998/namespace", "xml:space", l);
        break;
      case "is":
        hr(e, "is", l);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) ||
          (n[0] !== "o" && n[0] !== "O") ||
          (n[1] !== "n" && n[1] !== "N")) &&
          ((n = ub.get(n) || n), hr(e, n, l));
    }
  }
  function Ku(e, t, n, l, r, u) {
    switch (n) {
      case "style":
        Nf(e, l, u);
        break;
      case "dangerouslySetInnerHTML":
        if (l != null) {
          if (typeof l != "object" || !("__html" in l)) throw Error(o(61));
          if (((n = l.__html), n != null)) {
            if (r.children != null) throw Error(o(60));
            e.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof l == "string"
          ? gl(e, l)
          : (typeof l == "number" || typeof l == "bigint") && gl(e, "" + l);
        break;
      case "onScroll":
        l != null && Se("scroll", e);
        break;
      case "onScrollEnd":
        l != null && Se("scrollend", e);
        break;
      case "onClick":
        l != null && (e.onclick = Tn);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!gf.hasOwnProperty(n))
          e: {
            if (
              n[0] === "o" &&
              n[1] === "n" &&
              ((r = n.endsWith("Capture")),
              (t = n.slice(2, r ? n.length - 7 : void 0)),
              (u = e[Mt] || null),
              (u = u != null ? u[n] : null),
              typeof u == "function" && e.removeEventListener(t, u, r),
              typeof l == "function")
            ) {
              (typeof u != "function" &&
                u !== null &&
                (n in e
                  ? (e[n] = null)
                  : e.hasAttribute(n) && e.removeAttribute(n)),
                e.addEventListener(t, l, r));
              break e;
            }
            n in e
              ? (e[n] = l)
              : l === !0
                ? e.setAttribute(n, "")
                : hr(e, n, l);
          }
    }
  }
  function ht(e, t, n) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        (Se("error", e), Se("load", e));
        var l = !1,
          r = !1,
          u;
        for (u in n)
          if (n.hasOwnProperty(u)) {
            var m = n[u];
            if (m != null)
              switch (u) {
                case "src":
                  l = !0;
                  break;
                case "srcSet":
                  r = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(o(137, t));
                default:
                  Oe(e, t, u, m, n, null);
              }
          }
        (r && Oe(e, t, "srcSet", n.srcSet, n, null),
          l && Oe(e, t, "src", n.src, n, null));
        return;
      case "input":
        Se("invalid", e);
        var x = (u = m = r = null),
          w = null,
          O = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var G = n[l];
            if (G != null)
              switch (l) {
                case "name":
                  r = G;
                  break;
                case "type":
                  m = G;
                  break;
                case "checked":
                  w = G;
                  break;
                case "defaultChecked":
                  O = G;
                  break;
                case "value":
                  u = G;
                  break;
                case "defaultValue":
                  x = G;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (G != null) throw Error(o(137, t));
                  break;
                default:
                  Oe(e, t, l, G, n, null);
              }
          }
        xf(e, u, x, w, O, m, r, !1);
        return;
      case "select":
        (Se("invalid", e), (l = m = u = null));
        for (r in n)
          if (n.hasOwnProperty(r) && ((x = n[r]), x != null))
            switch (r) {
              case "value":
                u = x;
                break;
              case "defaultValue":
                m = x;
                break;
              case "multiple":
                l = x;
              default:
                Oe(e, t, r, x, n, null);
            }
        ((t = u),
          (n = m),
          (e.multiple = !!l),
          t != null ? hl(e, !!l, t, !1) : n != null && hl(e, !!l, n, !0));
        return;
      case "textarea":
        (Se("invalid", e), (u = r = l = null));
        for (m in n)
          if (n.hasOwnProperty(m) && ((x = n[m]), x != null))
            switch (m) {
              case "value":
                l = x;
                break;
              case "defaultValue":
                r = x;
                break;
              case "children":
                u = x;
                break;
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(o(91));
                break;
              default:
                Oe(e, t, m, x, n, null);
            }
        Ef(e, l, r, u);
        return;
      case "option":
        for (w in n)
          n.hasOwnProperty(w) &&
            ((l = n[w]), l != null) &&
            (w === "selected"
              ? (e.selected =
                  l && typeof l != "function" && typeof l != "symbol")
              : Oe(e, t, w, l, n, null));
        return;
      case "dialog":
        (Se("beforetoggle", e),
          Se("toggle", e),
          Se("cancel", e),
          Se("close", e));
        break;
      case "iframe":
      case "object":
        Se("load", e);
        break;
      case "video":
      case "audio":
        for (l = 0; l < Xi.length; l++) Se(Xi[l], e);
        break;
      case "image":
        (Se("error", e), Se("load", e));
        break;
      case "details":
        Se("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        (Se("error", e), Se("load", e));
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (O in n)
          if (n.hasOwnProperty(O) && ((l = n[O]), l != null))
            switch (O) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(o(137, t));
              default:
                Oe(e, t, O, l, n, null);
            }
        return;
      default:
        if (ro(t)) {
          for (G in n)
            n.hasOwnProperty(G) &&
              ((l = n[G]), l !== void 0 && Ku(e, t, G, l, n, void 0));
          return;
        }
    }
    for (x in n)
      n.hasOwnProperty(x) && ((l = n[x]), l != null && Oe(e, t, x, l, n, null));
  }
  function Uy(e, t, n, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var r = null,
          u = null,
          m = null,
          x = null,
          w = null,
          O = null,
          G = null;
        for (U in n) {
          var Q = n[U];
          if (n.hasOwnProperty(U) && Q != null)
            switch (U) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                w = Q;
              default:
                l.hasOwnProperty(U) || Oe(e, t, U, null, l, Q);
            }
        }
        for (var k in l) {
          var U = l[k];
          if (((Q = n[k]), l.hasOwnProperty(k) && (U != null || Q != null)))
            switch (k) {
              case "type":
                u = U;
                break;
              case "name":
                r = U;
                break;
              case "checked":
                O = U;
                break;
              case "defaultChecked":
                G = U;
                break;
              case "value":
                m = U;
                break;
              case "defaultValue":
                x = U;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (U != null) throw Error(o(137, t));
                break;
              default:
                U !== Q && Oe(e, t, k, U, l, Q);
            }
        }
        lo(e, m, x, w, O, G, u, r);
        return;
      case "select":
        U = m = x = k = null;
        for (u in n)
          if (((w = n[u]), n.hasOwnProperty(u) && w != null))
            switch (u) {
              case "value":
                break;
              case "multiple":
                U = w;
              default:
                l.hasOwnProperty(u) || Oe(e, t, u, null, l, w);
            }
        for (r in l)
          if (
            ((u = l[r]),
            (w = n[r]),
            l.hasOwnProperty(r) && (u != null || w != null))
          )
            switch (r) {
              case "value":
                k = u;
                break;
              case "defaultValue":
                x = u;
                break;
              case "multiple":
                m = u;
              default:
                u !== w && Oe(e, t, r, u, l, w);
            }
        ((t = x),
          (n = m),
          (l = U),
          k != null
            ? hl(e, !!n, k, !1)
            : !!l != !!n &&
              (t != null ? hl(e, !!n, t, !0) : hl(e, !!n, n ? [] : "", !1)));
        return;
      case "textarea":
        U = k = null;
        for (x in n)
          if (
            ((r = n[x]),
            n.hasOwnProperty(x) && r != null && !l.hasOwnProperty(x))
          )
            switch (x) {
              case "value":
                break;
              case "children":
                break;
              default:
                Oe(e, t, x, null, l, r);
            }
        for (m in l)
          if (
            ((r = l[m]),
            (u = n[m]),
            l.hasOwnProperty(m) && (r != null || u != null))
          )
            switch (m) {
              case "value":
                k = r;
                break;
              case "defaultValue":
                U = r;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (r != null) throw Error(o(91));
                break;
              default:
                r !== u && Oe(e, t, m, r, l, u);
            }
        Sf(e, k, U);
        return;
      case "option":
        for (var ne in n)
          ((k = n[ne]),
            n.hasOwnProperty(ne) &&
              k != null &&
              !l.hasOwnProperty(ne) &&
              (ne === "selected"
                ? (e.selected = !1)
                : Oe(e, t, ne, null, l, k)));
        for (w in l)
          ((k = l[w]),
            (U = n[w]),
            l.hasOwnProperty(w) &&
              k !== U &&
              (k != null || U != null) &&
              (w === "selected"
                ? (e.selected =
                    k && typeof k != "function" && typeof k != "symbol")
                : Oe(e, t, w, k, l, U)));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var oe in n)
          ((k = n[oe]),
            n.hasOwnProperty(oe) &&
              k != null &&
              !l.hasOwnProperty(oe) &&
              Oe(e, t, oe, null, l, k));
        for (O in l)
          if (
            ((k = l[O]),
            (U = n[O]),
            l.hasOwnProperty(O) && k !== U && (k != null || U != null))
          )
            switch (O) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (k != null) throw Error(o(137, t));
                break;
              default:
                Oe(e, t, O, k, l, U);
            }
        return;
      default:
        if (ro(t)) {
          for (var ke in n)
            ((k = n[ke]),
              n.hasOwnProperty(ke) &&
                k !== void 0 &&
                !l.hasOwnProperty(ke) &&
                Ku(e, t, ke, void 0, l, k));
          for (G in l)
            ((k = l[G]),
              (U = n[G]),
              !l.hasOwnProperty(G) ||
                k === U ||
                (k === void 0 && U === void 0) ||
                Ku(e, t, G, k, l, U));
          return;
        }
    }
    for (var R in n)
      ((k = n[R]),
        n.hasOwnProperty(R) &&
          k != null &&
          !l.hasOwnProperty(R) &&
          Oe(e, t, R, null, l, k));
    for (Q in l)
      ((k = l[Q]),
        (U = n[Q]),
        !l.hasOwnProperty(Q) ||
          k === U ||
          (k == null && U == null) ||
          Oe(e, t, Q, k, l, U));
  }
  function _h(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Ly() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var e = 0, t = 0, n = performance.getEntriesByType("resource"), l = 0;
        l < n.length;
        l++
      ) {
        var r = n[l],
          u = r.transferSize,
          m = r.initiatorType,
          x = r.duration;
        if (u && x && _h(m)) {
          for (m = 0, x = r.responseEnd, l += 1; l < n.length; l++) {
            var w = n[l],
              O = w.startTime;
            if (O > x) break;
            var G = w.transferSize,
              Q = w.initiatorType;
            G &&
              _h(Q) &&
              ((w = w.responseEnd), (m += G * (w < x ? 1 : (x - O) / (w - O))));
          }
          if ((--l, (t += (8 * (u + m)) / (r.duration / 1e3)), e++, 10 < e))
            break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection &&
      ((e = navigator.connection.downlink), typeof e == "number")
      ? e
      : 5;
  }
  var Ju = null,
    $u = null;
  function ds(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function jh(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Th(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function Fu(e, t) {
    return (
      e === "textarea" ||
      e === "noscript" ||
      typeof t.children == "string" ||
      typeof t.children == "number" ||
      typeof t.children == "bigint" ||
      (typeof t.dangerouslySetInnerHTML == "object" &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var Wu = null;
  function By() {
    var e = window.event;
    return e && e.type === "popstate"
      ? e === Wu
        ? !1
        : ((Wu = e), !0)
      : ((Wu = null), !1);
  }
  var Ch = typeof setTimeout == "function" ? setTimeout : void 0,
    Hy = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Ah = typeof Promise == "function" ? Promise : void 0,
    Gy =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Ah < "u"
          ? function (e) {
              return Ah.resolve(null).then(e).catch(Yy);
            }
          : Ch;
  function Yy(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function xa(e) {
    return e === "head";
  }
  function Rh(e, t) {
    var n = t,
      l = 0;
    do {
      var r = n.nextSibling;
      if ((e.removeChild(n), r && r.nodeType === 8))
        if (((n = r.data), n === "/$" || n === "/&")) {
          if (l === 0) {
            (e.removeChild(r), Zl(t));
            return;
          }
          l--;
        } else if (
          n === "$" ||
          n === "$?" ||
          n === "$~" ||
          n === "$!" ||
          n === "&"
        )
          l++;
        else if (n === "html") Zi(e.ownerDocument.documentElement);
        else if (n === "head") {
          ((n = e.ownerDocument.head), Zi(n));
          for (var u = n.firstChild; u; ) {
            var m = u.nextSibling,
              x = u.nodeName;
            (u[ci] ||
              x === "SCRIPT" ||
              x === "STYLE" ||
              (x === "LINK" && u.rel.toLowerCase() === "stylesheet") ||
              n.removeChild(u),
              (u = m));
          }
        } else n === "body" && Zi(e.ownerDocument.body);
      n = r;
    } while (n);
    Zl(t);
  }
  function zh(e, t) {
    var n = e;
    e = 0;
    do {
      var l = n.nextSibling;
      if (
        (n.nodeType === 1
          ? t
            ? ((n._stashedDisplay = n.style.display),
              (n.style.display = "none"))
            : ((n.style.display = n._stashedDisplay || ""),
              n.getAttribute("style") === "" && n.removeAttribute("style"))
          : n.nodeType === 3 &&
            (t
              ? ((n._stashedText = n.nodeValue), (n.nodeValue = ""))
              : (n.nodeValue = n._stashedText || "")),
        l && l.nodeType === 8)
      )
        if (((n = l.data), n === "/$")) {
          if (e === 0) break;
          e--;
        } else (n !== "$" && n !== "$?" && n !== "$~" && n !== "$!") || e++;
      n = l;
    } while (n);
  }
  function Iu(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var n = t;
      switch (((t = t.nextSibling), n.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          (Iu(n), no(n));
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(n);
    }
  }
  function qy(e, t, n, l) {
    for (; e.nodeType === 1; ) {
      var r = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== "INPUT" || e.type !== "hidden")) break;
      } else if (l) {
        if (!e[ci])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (
                ((u = e.getAttribute("rel")),
                u === "stylesheet" && e.hasAttribute("data-precedence"))
              )
                break;
              if (
                u !== r.rel ||
                e.getAttribute("href") !==
                  (r.href == null || r.href === "" ? null : r.href) ||
                e.getAttribute("crossorigin") !==
                  (r.crossOrigin == null ? null : r.crossOrigin) ||
                e.getAttribute("title") !== (r.title == null ? null : r.title)
              )
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (
                ((u = e.getAttribute("src")),
                (u !== (r.src == null ? null : r.src) ||
                  e.getAttribute("type") !== (r.type == null ? null : r.type) ||
                  e.getAttribute("crossorigin") !==
                    (r.crossOrigin == null ? null : r.crossOrigin)) &&
                  u &&
                  e.hasAttribute("async") &&
                  !e.hasAttribute("itemprop"))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var u = r.name == null ? null : "" + r.name;
        if (r.type === "hidden" && e.getAttribute("name") === u) return e;
      } else return e;
      if (((e = ln(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function Vy(e, t, n) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") &&
          !n) ||
        ((e = ln(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Mh(e, t) {
    for (; e.nodeType !== 8; )
      if (
        ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") &&
          !t) ||
        ((e = ln(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Pu(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function ec(e) {
    return (
      e.data === "$!" ||
      (e.data === "$?" && e.ownerDocument.readyState !== "loading")
    );
  }
  function Xy(e, t) {
    var n = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || n.readyState !== "loading") t();
    else {
      var l = function () {
        (t(), n.removeEventListener("DOMContentLoaded", l));
      };
      (n.addEventListener("DOMContentLoaded", l), (e._reactRetry = l));
    }
  }
  function ln(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = e.data),
          t === "$" ||
            t === "$!" ||
            t === "$?" ||
            t === "$~" ||
            t === "&" ||
            t === "F!" ||
            t === "F")
        )
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var tc = null;
  function Dh(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "/$" || n === "/&") {
          if (t === 0) return ln(e.nextSibling);
          t--;
        } else
          (n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&") ||
            t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function Oh(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (t === 0) return e;
          t--;
        } else (n !== "/$" && n !== "/&") || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function kh(e, t, n) {
    switch (((t = ds(n)), e)) {
      case "html":
        if (((e = t.documentElement), !e)) throw Error(o(452));
        return e;
      case "head":
        if (((e = t.head), !e)) throw Error(o(453));
        return e;
      case "body":
        if (((e = t.body), !e)) throw Error(o(454));
        return e;
      default:
        throw Error(o(451));
    }
  }
  function Zi(e) {
    for (var t = e.attributes; t.length; ) e.removeAttributeNode(t[0]);
    no(e);
  }
  var rn = new Map(),
    Uh = new Set();
  function ms(e) {
    return typeof e.getRootNode == "function"
      ? e.getRootNode()
      : e.nodeType === 9
        ? e
        : e.ownerDocument;
  }
  var Vn = K.d;
  K.d = { f: Qy, r: Zy, D: Ky, C: Jy, L: $y, m: Fy, X: Iy, S: Wy, M: Py };
  function Qy() {
    var e = Vn.f(),
      t = ls();
    return e || t;
  }
  function Zy(e) {
    var t = fl(e);
    t !== null && t.tag === 5 && t.type === "form" ? Pd(t) : Vn.r(e);
  }
  var Vl = typeof document > "u" ? null : document;
  function Lh(e, t, n) {
    var l = Vl;
    if (l && typeof t == "string" && t) {
      var r = Wt(t);
      ((r = 'link[rel="' + e + '"][href="' + r + '"]'),
        typeof n == "string" && (r += '[crossorigin="' + n + '"]'),
        Uh.has(r) ||
          (Uh.add(r),
          (e = { rel: e, crossOrigin: n, href: t }),
          l.querySelector(r) === null &&
            ((t = l.createElement("link")),
            ht(t, "link", e),
            st(t),
            l.head.appendChild(t))));
    }
  }
  function Ky(e) {
    (Vn.D(e), Lh("dns-prefetch", e, null));
  }
  function Jy(e, t) {
    (Vn.C(e, t), Lh("preconnect", e, t));
  }
  function $y(e, t, n) {
    Vn.L(e, t, n);
    var l = Vl;
    if (l && e && t) {
      var r = 'link[rel="preload"][as="' + Wt(t) + '"]';
      t === "image" && n && n.imageSrcSet
        ? ((r += '[imagesrcset="' + Wt(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == "string" &&
            (r += '[imagesizes="' + Wt(n.imageSizes) + '"]'))
        : (r += '[href="' + Wt(e) + '"]');
      var u = r;
      switch (t) {
        case "style":
          u = Xl(e);
          break;
        case "script":
          u = Ql(e);
      }
      rn.has(u) ||
        ((e = p(
          {
            rel: "preload",
            href: t === "image" && n && n.imageSrcSet ? void 0 : e,
            as: t,
          },
          n,
        )),
        rn.set(u, e),
        l.querySelector(r) !== null ||
          (t === "style" && l.querySelector(Ki(u))) ||
          (t === "script" && l.querySelector(Ji(u))) ||
          ((t = l.createElement("link")),
          ht(t, "link", e),
          st(t),
          l.head.appendChild(t)));
    }
  }
  function Fy(e, t) {
    Vn.m(e, t);
    var n = Vl;
    if (n && e) {
      var l = t && typeof t.as == "string" ? t.as : "script",
        r =
          'link[rel="modulepreload"][as="' + Wt(l) + '"][href="' + Wt(e) + '"]',
        u = r;
      switch (l) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = Ql(e);
      }
      if (
        !rn.has(u) &&
        ((e = p({ rel: "modulepreload", href: e }, t)),
        rn.set(u, e),
        n.querySelector(r) === null)
      ) {
        switch (l) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(Ji(u))) return;
        }
        ((l = n.createElement("link")),
          ht(l, "link", e),
          st(l),
          n.head.appendChild(l));
      }
    }
  }
  function Wy(e, t, n) {
    Vn.S(e, t, n);
    var l = Vl;
    if (l && e) {
      var r = dl(l).hoistableStyles,
        u = Xl(e);
      t = t || "default";
      var m = r.get(u);
      if (!m) {
        var x = { loading: 0, preload: null };
        if ((m = l.querySelector(Ki(u)))) x.loading = 5;
        else {
          ((e = p({ rel: "stylesheet", href: e, "data-precedence": t }, n)),
            (n = rn.get(u)) && nc(e, n));
          var w = (m = l.createElement("link"));
          (st(w),
            ht(w, "link", e),
            (w._p = new Promise(function (O, G) {
              ((w.onload = O), (w.onerror = G));
            })),
            w.addEventListener("load", function () {
              x.loading |= 1;
            }),
            w.addEventListener("error", function () {
              x.loading |= 2;
            }),
            (x.loading |= 4),
            hs(m, t, l));
        }
        ((m = { type: "stylesheet", instance: m, count: 1, state: x }),
          r.set(u, m));
      }
    }
  }
  function Iy(e, t) {
    Vn.X(e, t);
    var n = Vl;
    if (n && e) {
      var l = dl(n).hoistableScripts,
        r = Ql(e),
        u = l.get(r);
      u ||
        ((u = n.querySelector(Ji(r))),
        u ||
          ((e = p({ src: e, async: !0 }, t)),
          (t = rn.get(r)) && ac(e, t),
          (u = n.createElement("script")),
          st(u),
          ht(u, "link", e),
          n.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        l.set(r, u));
    }
  }
  function Py(e, t) {
    Vn.M(e, t);
    var n = Vl;
    if (n && e) {
      var l = dl(n).hoistableScripts,
        r = Ql(e),
        u = l.get(r);
      u ||
        ((u = n.querySelector(Ji(r))),
        u ||
          ((e = p({ src: e, async: !0, type: "module" }, t)),
          (t = rn.get(r)) && ac(e, t),
          (u = n.createElement("script")),
          st(u),
          ht(u, "link", e),
          n.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        l.set(r, u));
    }
  }
  function Bh(e, t, n, l) {
    var r = (r = te.current) ? ms(r) : null;
    if (!r) throw Error(o(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string"
          ? ((t = Xl(n.href)),
            (n = dl(r).hoistableStyles),
            (l = n.get(t)),
            l ||
              ((l = { type: "style", instance: null, count: 0, state: null }),
              n.set(t, l)),
            l)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          n.rel === "stylesheet" &&
          typeof n.href == "string" &&
          typeof n.precedence == "string"
        ) {
          e = Xl(n.href);
          var u = dl(r).hoistableStyles,
            m = u.get(e);
          if (
            (m ||
              ((r = r.ownerDocument || r),
              (m = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              u.set(e, m),
              (u = r.querySelector(Ki(e))) &&
                !u._p &&
                ((m.instance = u), (m.state.loading = 5)),
              rn.has(e) ||
                ((n = {
                  rel: "preload",
                  as: "style",
                  href: n.href,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  media: n.media,
                  hrefLang: n.hrefLang,
                  referrerPolicy: n.referrerPolicy,
                }),
                rn.set(e, n),
                u || e0(r, e, n, m.state))),
            t && l === null)
          )
            throw Error(o(528, ""));
          return m;
        }
        if (t && l !== null) throw Error(o(529, ""));
        return null;
      case "script":
        return (
          (t = n.async),
          (n = n.src),
          typeof n == "string" &&
          t &&
          typeof t != "function" &&
          typeof t != "symbol"
            ? ((t = Ql(n)),
              (n = dl(r).hoistableScripts),
              (l = n.get(t)),
              l ||
                ((l = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                n.set(t, l)),
              l)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(o(444, e));
    }
  }
  function Xl(e) {
    return 'href="' + Wt(e) + '"';
  }
  function Ki(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Hh(e) {
    return p({}, e, { "data-precedence": e.precedence, precedence: null });
  }
  function e0(e, t, n, l) {
    e.querySelector('link[rel="preload"][as="style"][' + t + "]")
      ? (l.loading = 1)
      : ((t = e.createElement("link")),
        (l.preload = t),
        t.addEventListener("load", function () {
          return (l.loading |= 1);
        }),
        t.addEventListener("error", function () {
          return (l.loading |= 2);
        }),
        ht(t, "link", n),
        st(t),
        e.head.appendChild(t));
  }
  function Ql(e) {
    return '[src="' + Wt(e) + '"]';
  }
  function Ji(e) {
    return "script[async]" + e;
  }
  function Gh(e, t, n) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case "style":
          var l = e.querySelector('style[data-href~="' + Wt(n.href) + '"]');
          if (l) return ((t.instance = l), st(l), l);
          var r = p({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null,
          });
          return (
            (l = (e.ownerDocument || e).createElement("style")),
            st(l),
            ht(l, "style", r),
            hs(l, n.precedence, e),
            (t.instance = l)
          );
        case "stylesheet":
          r = Xl(n.href);
          var u = e.querySelector(Ki(r));
          if (u) return ((t.state.loading |= 4), (t.instance = u), st(u), u);
          ((l = Hh(n)),
            (r = rn.get(r)) && nc(l, r),
            (u = (e.ownerDocument || e).createElement("link")),
            st(u));
          var m = u;
          return (
            (m._p = new Promise(function (x, w) {
              ((m.onload = x), (m.onerror = w));
            })),
            ht(u, "link", l),
            (t.state.loading |= 4),
            hs(u, n.precedence, e),
            (t.instance = u)
          );
        case "script":
          return (
            (u = Ql(n.src)),
            (r = e.querySelector(Ji(u)))
              ? ((t.instance = r), st(r), r)
              : ((l = n),
                (r = rn.get(u)) && ((l = p({}, n)), ac(l, r)),
                (e = e.ownerDocument || e),
                (r = e.createElement("script")),
                st(r),
                ht(r, "link", l),
                e.head.appendChild(r),
                (t.instance = r))
          );
        case "void":
          return null;
        default:
          throw Error(o(443, t.type));
      }
    else
      t.type === "stylesheet" &&
        (t.state.loading & 4) === 0 &&
        ((l = t.instance), (t.state.loading |= 4), hs(l, n.precedence, e));
    return t.instance;
  }
  function hs(e, t, n) {
    for (
      var l = n.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]',
        ),
        r = l.length ? l[l.length - 1] : null,
        u = r,
        m = 0;
      m < l.length;
      m++
    ) {
      var x = l[m];
      if (x.dataset.precedence === t) u = x;
      else if (u !== r) break;
    }
    u
      ? u.parentNode.insertBefore(e, u.nextSibling)
      : ((t = n.nodeType === 9 ? n.head : n), t.insertBefore(e, t.firstChild));
  }
  function nc(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function ac(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var gs = null;
  function Yh(e, t, n) {
    if (gs === null) {
      var l = new Map(),
        r = (gs = new Map());
      r.set(n, l);
    } else ((r = gs), (l = r.get(n)), l || ((l = new Map()), r.set(n, l)));
    if (l.has(e)) return l;
    for (
      l.set(e, null), n = n.getElementsByTagName(e), r = 0;
      r < n.length;
      r++
    ) {
      var u = n[r];
      if (
        !(
          u[ci] ||
          u[ct] ||
          (e === "link" && u.getAttribute("rel") === "stylesheet")
        ) &&
        u.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var m = u.getAttribute(t) || "";
        m = e + m;
        var x = l.get(m);
        x ? x.push(u) : l.set(m, [u]);
      }
    }
    return l;
  }
  function qh(e, t, n) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(
        n,
        t === "title" ? e.querySelector("head > title") : null,
      ));
  }
  function t0(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof t.precedence != "string" ||
          typeof t.href != "string" ||
          t.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof t.rel != "string" ||
          typeof t.href != "string" ||
          t.href === "" ||
          t.onLoad ||
          t.onError
        )
          break;
        return t.rel === "stylesheet"
          ? ((e = t.disabled), typeof t.precedence == "string" && e == null)
          : !0;
      case "script":
        if (
          t.async &&
          typeof t.async != "function" &&
          typeof t.async != "symbol" &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function Vh(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function n0(e, t, n, l) {
    if (
      n.type === "stylesheet" &&
      (typeof l.media != "string" || matchMedia(l.media).matches !== !1) &&
      (n.state.loading & 4) === 0
    ) {
      if (n.instance === null) {
        var r = Xl(l.href),
          u = t.querySelector(Ki(r));
        if (u) {
          ((t = u._p),
            t !== null &&
              typeof t == "object" &&
              typeof t.then == "function" &&
              (e.count++, (e = ps.bind(e)), t.then(e, e)),
            (n.state.loading |= 4),
            (n.instance = u),
            st(u));
          return;
        }
        ((u = t.ownerDocument || t),
          (l = Hh(l)),
          (r = rn.get(r)) && nc(l, r),
          (u = u.createElement("link")),
          st(u));
        var m = u;
        ((m._p = new Promise(function (x, w) {
          ((m.onload = x), (m.onerror = w));
        })),
          ht(u, "link", l),
          (n.instance = u));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(n, t),
        (t = n.state.preload) &&
          (n.state.loading & 3) === 0 &&
          (e.count++,
          (n = ps.bind(e)),
          t.addEventListener("load", n),
          t.addEventListener("error", n)));
    }
  }
  var lc = 0;
  function a0(e, t) {
    return (
      e.stylesheets && e.count === 0 && bs(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (n) {
            var l = setTimeout(function () {
              if ((e.stylesheets && bs(e, e.stylesheets), e.unsuspend)) {
                var u = e.unsuspend;
                ((e.unsuspend = null), u());
              }
            }, 6e4 + t);
            0 < e.imgBytes && lc === 0 && (lc = 62500 * Ly());
            var r = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 &&
                    (e.stylesheets && bs(e, e.stylesheets), e.unsuspend))
                ) {
                  var u = e.unsuspend;
                  ((e.unsuspend = null), u());
                }
              },
              (e.imgBytes > lc ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = n),
              function () {
                ((e.unsuspend = null), clearTimeout(l), clearTimeout(r));
              }
            );
          }
        : null
    );
  }
  function ps() {
    if (
      (this.count--,
      this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
    ) {
      if (this.stylesheets) bs(this, this.stylesheets);
      else if (this.unsuspend) {
        var e = this.unsuspend;
        ((this.unsuspend = null), e());
      }
    }
  }
  var vs = null;
  function bs(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++,
        (vs = new Map()),
        t.forEach(l0, e),
        (vs = null),
        ps.call(e)));
  }
  function l0(e, t) {
    if (!(t.state.loading & 4)) {
      var n = vs.get(e);
      if (n) var l = n.get(null);
      else {
        ((n = new Map()), vs.set(e, n));
        for (
          var r = e.querySelectorAll(
              "link[data-precedence],style[data-precedence]",
            ),
            u = 0;
          u < r.length;
          u++
        ) {
          var m = r[u];
          (m.nodeName === "LINK" || m.getAttribute("media") !== "not all") &&
            (n.set(m.dataset.precedence, m), (l = m));
        }
        l && n.set(null, l);
      }
      ((r = t.instance),
        (m = r.getAttribute("data-precedence")),
        (u = n.get(m) || l),
        u === l && n.set(null, r),
        n.set(m, r),
        this.count++,
        (l = ps.bind(this)),
        r.addEventListener("load", l),
        r.addEventListener("error", l),
        u
          ? u.parentNode.insertBefore(r, u.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e),
            e.insertBefore(r, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var $i = {
    $$typeof: L,
    Provider: null,
    Consumer: null,
    _currentValue: ie,
    _currentValue2: ie,
    _threadCount: 0,
  };
  function i0(e, t, n, l, r, u, m, x, w) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = ta(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = ta(0)),
      (this.hiddenUpdates = ta(null)),
      (this.identifierPrefix = l),
      (this.onUncaughtError = r),
      (this.onCaughtError = u),
      (this.onRecoverableError = m),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = w),
      (this.incompleteTransitions = new Map()));
  }
  function Xh(e, t, n, l, r, u, m, x, w, O, G, Q) {
    return (
      (e = new i0(e, t, n, m, w, O, G, Q, x)),
      (t = 1),
      u === !0 && (t |= 24),
      (u = Vt(3, null, null, t)),
      (e.current = u),
      (u.stateNode = e),
      (t = Lo()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (u.memoizedState = { element: l, isDehydrated: n, cache: t }),
      Yo(u),
      e
    );
  }
  function Qh(e) {
    return e ? ((e = El), e) : El;
  }
  function Zh(e, t, n, l, r, u) {
    ((r = Qh(r)),
      l.context === null ? (l.context = r) : (l.pendingContext = r),
      (l = ua(t)),
      (l.payload = { element: n }),
      (u = u === void 0 ? null : u),
      u !== null && (l.callback = u),
      (n = ca(e, l, t)),
      n !== null && (Bt(n, e, t), Ti(n, e, t)));
  }
  function Kh(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function ic(e, t) {
    (Kh(e, t), (e = e.alternate) && Kh(e, t));
  }
  function Jh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Ya(e, 67108864);
      (t !== null && Bt(t, e, 67108864), ic(e, 67108864));
    }
  }
  function $h(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Jt();
      t = ol(t);
      var n = Ya(e, t);
      (n !== null && Bt(n, e, t), ic(e, t));
    }
  }
  var ys = !0;
  function r0(e, t, n, l) {
    var r = M.T;
    M.T = null;
    var u = K.p;
    try {
      ((K.p = 2), rc(e, t, n, l));
    } finally {
      ((K.p = u), (M.T = r));
    }
  }
  function s0(e, t, n, l) {
    var r = M.T;
    M.T = null;
    var u = K.p;
    try {
      ((K.p = 8), rc(e, t, n, l));
    } finally {
      ((K.p = u), (M.T = r));
    }
  }
  function rc(e, t, n, l) {
    if (ys) {
      var r = sc(l);
      if (r === null) (Zu(e, t, l, xs, n), Wh(e, l));
      else if (u0(r, e, t, n, l)) l.stopPropagation();
      else if ((Wh(e, l), t & 4 && -1 < o0.indexOf(e))) {
        for (; r !== null; ) {
          var u = fl(r);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var m = gn(u.pendingLanes);
                  if (m !== 0) {
                    var x = u;
                    for (x.pendingLanes |= 2, x.entangledLanes |= 2; m; ) {
                      var w = 1 << (31 - yt(m));
                      ((x.entanglements[1] |= w), (m &= ~w));
                    }
                    (yn(u), (Re & 6) === 0 && ((ns = _t() + 500), Vi(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((x = Ya(u, 2)), x !== null && Bt(x, u, 2), ls(), ic(u, 2));
            }
          if (((u = sc(l)), u === null && Zu(e, t, l, xs, n), u === r)) break;
          r = u;
        }
        r !== null && l.stopPropagation();
      } else Zu(e, t, l, null, n);
    }
  }
  function sc(e) {
    return ((e = oo(e)), oc(e));
  }
  var xs = null;
  function oc(e) {
    if (((xs = null), (e = cl(e)), e !== null)) {
      var t = d(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (((e = h(t)), e !== null)) return e;
          e = null;
        } else if (n === 31) {
          if (((e = v(t)), e !== null)) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((xs = e), null);
  }
  function Fh(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Is()) {
          case Ma:
            return 2;
          case dr:
            return 8;
          case Da:
          case oi:
            return 32;
          case _n:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var uc = !1,
    Sa = null,
    Ea = null,
    wa = null,
    Fi = new Map(),
    Wi = new Map(),
    Na = [],
    o0 =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " ",
      );
  function Wh(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Sa = null;
        break;
      case "dragenter":
      case "dragleave":
        Ea = null;
        break;
      case "mouseover":
      case "mouseout":
        wa = null;
        break;
      case "pointerover":
      case "pointerout":
        Fi.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Wi.delete(t.pointerId);
    }
  }
  function Ii(e, t, n, l, r, u) {
    return e === null || e.nativeEvent !== u
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: l,
          nativeEvent: u,
          targetContainers: [r],
        }),
        t !== null && ((t = fl(t)), t !== null && Jh(t)),
        e)
      : ((e.eventSystemFlags |= l),
        (t = e.targetContainers),
        r !== null && t.indexOf(r) === -1 && t.push(r),
        e);
  }
  function u0(e, t, n, l, r) {
    switch (t) {
      case "focusin":
        return ((Sa = Ii(Sa, e, t, n, l, r)), !0);
      case "dragenter":
        return ((Ea = Ii(Ea, e, t, n, l, r)), !0);
      case "mouseover":
        return ((wa = Ii(wa, e, t, n, l, r)), !0);
      case "pointerover":
        var u = r.pointerId;
        return (Fi.set(u, Ii(Fi.get(u) || null, e, t, n, l, r)), !0);
      case "gotpointercapture":
        return (
          (u = r.pointerId),
          Wi.set(u, Ii(Wi.get(u) || null, e, t, n, l, r)),
          !0
        );
    }
    return !1;
  }
  function Ih(e) {
    var t = cl(e.target);
    if (t !== null) {
      var n = d(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = h(n)), t !== null)) {
            ((e.blockedOn = t),
              df(e.priority, function () {
                $h(n);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = v(n)), t !== null)) {
            ((e.blockedOn = t),
              df(e.priority, function () {
                $h(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Ss(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = sc(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(n.type, n);
        ((so = l), n.target.dispatchEvent(l), (so = null));
      } else return ((t = fl(n)), t !== null && Jh(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function Ph(e, t, n) {
    Ss(e) && n.delete(t);
  }
  function c0() {
    ((uc = !1),
      Sa !== null && Ss(Sa) && (Sa = null),
      Ea !== null && Ss(Ea) && (Ea = null),
      wa !== null && Ss(wa) && (wa = null),
      Fi.forEach(Ph),
      Wi.forEach(Ph));
  }
  function Es(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      uc ||
        ((uc = !0),
        a.unstable_scheduleCallback(a.unstable_NormalPriority, c0)));
  }
  var ws = null;
  function eg(e) {
    ws !== e &&
      ((ws = e),
      a.unstable_scheduleCallback(a.unstable_NormalPriority, function () {
        ws === e && (ws = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t],
            l = e[t + 1],
            r = e[t + 2];
          if (typeof l != "function") {
            if (oc(l || n) === null) continue;
            break;
          }
          var u = fl(n);
          u !== null &&
            (e.splice(t, 3),
            (t -= 3),
            su(u, { pending: !0, data: r, method: n.method, action: l }, l, r));
        }
      }));
  }
  function Zl(e) {
    function t(w) {
      return Es(w, e);
    }
    (Sa !== null && Es(Sa, e),
      Ea !== null && Es(Ea, e),
      wa !== null && Es(wa, e),
      Fi.forEach(t),
      Wi.forEach(t));
    for (var n = 0; n < Na.length; n++) {
      var l = Na[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Na.length && ((n = Na[0]), n.blockedOn === null); )
      (Ih(n), n.blockedOn === null && Na.shift());
    if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
      for (l = 0; l < n.length; l += 3) {
        var r = n[l],
          u = n[l + 1],
          m = r[Mt] || null;
        if (typeof u == "function") m || eg(n);
        else if (m) {
          var x = null;
          if (u && u.hasAttribute("formAction")) {
            if (((r = u), (m = u[Mt] || null))) x = m.formAction;
            else if (oc(r) !== null) continue;
          } else x = m.action;
          (typeof x == "function" ? (n[l + 1] = x) : (n.splice(l, 3), (l -= 3)),
            eg(n));
        }
      }
  }
  function tg() {
    function e(u) {
      u.canIntercept &&
        u.info === "react-transition" &&
        u.intercept({
          handler: function () {
            return new Promise(function (m) {
              return (r = m);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function t() {
      (r !== null && (r(), (r = null)), l || setTimeout(n, 20));
    }
    function n() {
      if (!l && !navigation.transition) {
        var u = navigation.currentEntry;
        u &&
          u.url != null &&
          navigation.navigate(u.url, {
            state: u.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var l = !1,
        r = null;
      return (
        navigation.addEventListener("navigate", e),
        navigation.addEventListener("navigatesuccess", t),
        navigation.addEventListener("navigateerror", t),
        setTimeout(n, 100),
        function () {
          ((l = !0),
            navigation.removeEventListener("navigate", e),
            navigation.removeEventListener("navigatesuccess", t),
            navigation.removeEventListener("navigateerror", t),
            r !== null && (r(), (r = null)));
        }
      );
    }
  }
  function cc(e) {
    this._internalRoot = e;
  }
  ((Ns.prototype.render = cc.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(o(409));
      var n = t.current,
        l = Jt();
      Zh(n, l, e, t, null, null);
    }),
    (Ns.prototype.unmount = cc.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (Zh(e.current, 2, null, e, null, null), ls(), (t[ul] = null));
        }
      }));
  function Ns(e) {
    this._internalRoot = e;
  }
  Ns.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = eo();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Na.length && t !== 0 && t < Na[n].priority; n++);
      (Na.splice(n, 0, e), n === 0 && Ih(e));
    }
  };
  var ng = i.version;
  if (ng !== "19.2.5") throw Error(o(527, ng, "19.2.5"));
  K.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function"
        ? Error(o(188))
        : ((e = Object.keys(e).join(",")), Error(o(268, e)));
    return (
      (e = g(t)),
      (e = e !== null ? S(e) : null),
      (e = e === null ? null : e.stateNode),
      e
    );
  };
  var f0 = {
    bundleType: 0,
    version: "19.2.5",
    rendererPackageName: "react-dom",
    currentDispatcherRef: M,
    reconcilerVersion: "19.2.5",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var _s = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!_s.isDisabled && _s.supportsFiber)
      try {
        ((Oa = _s.inject(f0)), (jt = _s));
      } catch {}
  }
  return (
    (er.createRoot = function (e, t) {
      if (!c(e)) throw Error(o(299));
      var n = !1,
        l = "",
        r = um,
        u = cm,
        m = fm;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (r = t.onUncaughtError),
          t.onCaughtError !== void 0 && (u = t.onCaughtError),
          t.onRecoverableError !== void 0 && (m = t.onRecoverableError)),
        (t = Xh(e, 1, !1, null, null, n, l, null, r, u, m, tg)),
        (e[ul] = t.current),
        Qu(e),
        new cc(t)
      );
    }),
    (er.hydrateRoot = function (e, t, n) {
      if (!c(e)) throw Error(o(299));
      var l = !1,
        r = "",
        u = um,
        m = cm,
        x = fm,
        w = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (l = !0),
          n.identifierPrefix !== void 0 && (r = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (u = n.onUncaughtError),
          n.onCaughtError !== void 0 && (m = n.onCaughtError),
          n.onRecoverableError !== void 0 && (x = n.onRecoverableError),
          n.formState !== void 0 && (w = n.formState)),
        (t = Xh(e, 1, !0, t, n ?? null, l, r, w, u, m, x, tg)),
        (t.context = Qh(null)),
        (n = t.current),
        (l = Jt()),
        (l = ol(l)),
        (r = ua(l)),
        (r.callback = null),
        ca(n, r, l),
        (n = l),
        (t.current.lanes = n),
        Ve(t, n),
        yn(t),
        (e[ul] = t.current),
        Qu(e),
        new Ns(t)
      );
    }),
    (er.version = "19.2.5"),
    er
  );
}
var dg;
function S0() {
  if (dg) return mc.exports;
  dg = 1;
  function a() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (i) {
        console.error(i);
      }
  }
  return (a(), (mc.exports = x0()), mc.exports);
}
var E0 = S0();
var mg = "popstate";
function hg(a) {
  return (
    typeof a == "object" &&
    a != null &&
    "pathname" in a &&
    "search" in a &&
    "hash" in a &&
    "state" in a &&
    "key" in a
  );
}
function w0(a = {}) {
  function i(o, c) {
    let d = c.state?.masked,
      { pathname: h, search: v, hash: y } = d || o.location;
    return Ac(
      "",
      { pathname: h, search: v, hash: y },
      (c.state && c.state.usr) || null,
      (c.state && c.state.key) || "default",
      d
        ? {
            pathname: o.location.pathname,
            search: o.location.search,
            hash: o.location.hash,
          }
        : void 0,
    );
  }
  function s(o, c) {
    return typeof c == "string" ? c : lr(c);
  }
  return _0(i, s, null, a);
}
function Xe(a, i) {
  if (a === !1 || a === null || typeof a > "u") throw new Error(i);
}
function wn(a, i) {
  if (!a) {
    typeof console < "u" && console.warn(i);
    try {
      throw new Error(i);
    } catch {}
  }
}
function N0() {
  return Math.random().toString(36).substring(2, 10);
}
function gg(a, i) {
  return {
    usr: a.state,
    key: a.key,
    idx: i,
    masked: a.unstable_mask
      ? { pathname: a.pathname, search: a.search, hash: a.hash }
      : void 0,
  };
}
function Ac(a, i, s = null, o, c) {
  return {
    pathname: typeof a == "string" ? a : a.pathname,
    search: "",
    hash: "",
    ...(typeof i == "string" ? ni(i) : i),
    state: s,
    key: (i && i.key) || o || N0(),
    unstable_mask: c,
  };
}
function lr({ pathname: a = "/", search: i = "", hash: s = "" }) {
  return (
    i && i !== "?" && (a += i.charAt(0) === "?" ? i : "?" + i),
    s && s !== "#" && (a += s.charAt(0) === "#" ? s : "#" + s),
    a
  );
}
function ni(a) {
  let i = {};
  if (a) {
    let s = a.indexOf("#");
    s >= 0 && ((i.hash = a.substring(s)), (a = a.substring(0, s)));
    let o = a.indexOf("?");
    (o >= 0 && ((i.search = a.substring(o)), (a = a.substring(0, o))),
      a && (i.pathname = a));
  }
  return i;
}
function _0(a, i, s, o = {}) {
  let { window: c = document.defaultView, v5Compat: d = !1 } = o,
    h = c.history,
    v = "POP",
    y = null,
    g = S();
  g == null && ((g = 0), h.replaceState({ ...h.state, idx: g }, ""));
  function S() {
    return (h.state || { idx: null }).idx;
  }
  function p() {
    v = "POP";
    let _ = S(),
      C = _ == null ? null : _ - g;
    ((g = _), y && y({ action: v, location: E.location, delta: C }));
  }
  function N(_, C) {
    v = "PUSH";
    let X = hg(_) ? _ : Ac(E.location, _, C);
    g = S() + 1;
    let L = gg(X, g),
      F = E.createHref(X.unstable_mask || X);
    try {
      h.pushState(L, "", F);
    } catch (H) {
      if (H instanceof DOMException && H.name === "DataCloneError") throw H;
      c.location.assign(F);
    }
    d && y && y({ action: v, location: E.location, delta: 1 });
  }
  function z(_, C) {
    v = "REPLACE";
    let X = hg(_) ? _ : Ac(E.location, _, C);
    g = S();
    let L = gg(X, g),
      F = E.createHref(X.unstable_mask || X);
    (h.replaceState(L, "", F),
      d && y && y({ action: v, location: E.location, delta: 0 }));
  }
  function A(_) {
    return j0(_);
  }
  let E = {
    get action() {
      return v;
    },
    get location() {
      return a(c, h);
    },
    listen(_) {
      if (y) throw new Error("A history only accepts one active listener");
      return (
        c.addEventListener(mg, p),
        (y = _),
        () => {
          (c.removeEventListener(mg, p), (y = null));
        }
      );
    },
    createHref(_) {
      return i(c, _);
    },
    createURL: A,
    encodeLocation(_) {
      let C = A(_);
      return { pathname: C.pathname, search: C.search, hash: C.hash };
    },
    push: N,
    replace: z,
    go(_) {
      return h.go(_);
    },
  };
  return E;
}
function j0(a, i = !1) {
  let s = "http://localhost";
  (typeof window < "u" &&
    (s =
      window.location.origin !== "null"
        ? window.location.origin
        : window.location.href),
    Xe(s, "No window.location.(origin|href) available to create URL"));
  let o = typeof a == "string" ? a : lr(a);
  return (
    (o = o.replace(/ $/, "%20")),
    !i && o.startsWith("//") && (o = s + o),
    new URL(o, s)
  );
}
function np(a, i, s = "/") {
  return T0(a, i, s, !1);
}
function T0(a, i, s, o) {
  let c = typeof i == "string" ? ni(i) : i,
    d = Zn(c.pathname || "/", s);
  if (d == null) return null;
  let h = ap(a);
  C0(h);
  let v = null;
  for (let y = 0; v == null && y < h.length; ++y) {
    let g = H0(d);
    v = L0(h[y], g, o);
  }
  return v;
}
function ap(a, i = [], s = [], o = "", c = !1) {
  let d = (h, v, y = c, g) => {
    let S = {
      relativePath: g === void 0 ? h.path || "" : g,
      caseSensitive: h.caseSensitive === !0,
      childrenIndex: v,
      route: h,
    };
    if (S.relativePath.startsWith("/")) {
      if (!S.relativePath.startsWith(o) && y) return;
      (Xe(
        S.relativePath.startsWith(o),
        `Absolute route path "${S.relativePath}" nested under path "${o}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`,
      ),
        (S.relativePath = S.relativePath.slice(o.length)));
    }
    let p = En([o, S.relativePath]),
      N = s.concat(S);
    (h.children &&
      h.children.length > 0 &&
      (Xe(
        h.index !== !0,
        `Index routes must not have child routes. Please remove all child routes from route path "${p}".`,
      ),
      ap(h.children, i, N, p, y)),
      !(h.path == null && !h.index) &&
        i.push({ path: p, score: k0(p, h.index), routesMeta: N }));
  };
  return (
    a.forEach((h, v) => {
      if (h.path === "" || !h.path?.includes("?")) d(h, v);
      else for (let y of lp(h.path)) d(h, v, !0, y);
    }),
    i
  );
}
function lp(a) {
  let i = a.split("/");
  if (i.length === 0) return [];
  let [s, ...o] = i,
    c = s.endsWith("?"),
    d = s.replace(/\?$/, "");
  if (o.length === 0) return c ? [d, ""] : [d];
  let h = lp(o.join("/")),
    v = [];
  return (
    v.push(...h.map((y) => (y === "" ? d : [d, y].join("/")))),
    c && v.push(...h),
    v.map((y) => (a.startsWith("/") && y === "" ? "/" : y))
  );
}
function C0(a) {
  a.sort((i, s) =>
    i.score !== s.score
      ? s.score - i.score
      : U0(
          i.routesMeta.map((o) => o.childrenIndex),
          s.routesMeta.map((o) => o.childrenIndex),
        ),
  );
}
var A0 = /^:[\w-]+$/,
  R0 = 3,
  z0 = 2,
  M0 = 1,
  D0 = 10,
  O0 = -2,
  pg = (a) => a === "*";
function k0(a, i) {
  let s = a.split("/"),
    o = s.length;
  return (
    s.some(pg) && (o += O0),
    i && (o += z0),
    s
      .filter((c) => !pg(c))
      .reduce((c, d) => c + (A0.test(d) ? R0 : d === "" ? M0 : D0), o)
  );
}
function U0(a, i) {
  return a.length === i.length && a.slice(0, -1).every((o, c) => o === i[c])
    ? a[a.length - 1] - i[i.length - 1]
    : 0;
}
function L0(a, i, s = !1) {
  let { routesMeta: o } = a,
    c = {},
    d = "/",
    h = [];
  for (let v = 0; v < o.length; ++v) {
    let y = o[v],
      g = v === o.length - 1,
      S = d === "/" ? i : i.slice(d.length) || "/",
      p = Gs(
        { path: y.relativePath, caseSensitive: y.caseSensitive, end: g },
        S,
      ),
      N = y.route;
    if (
      (!p &&
        g &&
        s &&
        !o[o.length - 1].route.index &&
        (p = Gs(
          { path: y.relativePath, caseSensitive: y.caseSensitive, end: !1 },
          S,
        )),
      !p)
    )
      return null;
    (Object.assign(c, p.params),
      h.push({
        params: c,
        pathname: En([d, p.pathname]),
        pathnameBase: V0(En([d, p.pathnameBase])),
        route: N,
      }),
      p.pathnameBase !== "/" && (d = En([d, p.pathnameBase])));
  }
  return h;
}
function Gs(a, i) {
  typeof a == "string" && (a = { path: a, caseSensitive: !1, end: !0 });
  let [s, o] = B0(a.path, a.caseSensitive, a.end),
    c = i.match(s);
  if (!c) return null;
  let d = c[0],
    h = d.replace(/(.)\/+$/, "$1"),
    v = c.slice(1);
  return {
    params: o.reduce((g, { paramName: S, isOptional: p }, N) => {
      if (S === "*") {
        let A = v[N] || "";
        h = d.slice(0, d.length - A.length).replace(/(.)\/+$/, "$1");
      }
      const z = v[N];
      return (
        p && !z ? (g[S] = void 0) : (g[S] = (z || "").replace(/%2F/g, "/")),
        g
      );
    }, {}),
    pathname: d,
    pathnameBase: h,
    pattern: a,
  };
}
function B0(a, i = !1, s = !0) {
  wn(
    a === "*" || !a.endsWith("*") || a.endsWith("/*"),
    `Route path "${a}" will be treated as if it were "${a.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${a.replace(/\*$/, "/*")}".`,
  );
  let o = [],
    c =
      "^" +
      a
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(/\/:([\w-]+)(\?)?/g, (h, v, y, g, S) => {
          if ((o.push({ paramName: v, isOptional: y != null }), y)) {
            let p = S.charAt(g + h.length);
            return p && p !== "/" ? "/([^\\/]*)" : "(?:/([^\\/]*))?";
          }
          return "/([^\\/]+)";
        })
        .replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
  return (
    a.endsWith("*")
      ? (o.push({ paramName: "*" }),
        (c += a === "*" || a === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : s
        ? (c += "\\/*$")
        : a !== "" && a !== "/" && (c += "(?:(?=\\/|$))"),
    [new RegExp(c, i ? void 0 : "i"), o]
  );
}
function H0(a) {
  try {
    return a
      .split("/")
      .map((i) => decodeURIComponent(i).replace(/\//g, "%2F"))
      .join("/");
  } catch (i) {
    return (
      wn(
        !1,
        `The URL path "${a}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${i}).`,
      ),
      a
    );
  }
}
function Zn(a, i) {
  if (i === "/") return a;
  if (!a.toLowerCase().startsWith(i.toLowerCase())) return null;
  let s = i.endsWith("/") ? i.length - 1 : i.length,
    o = a.charAt(s);
  return o && o !== "/" ? null : a.slice(s) || "/";
}
var G0 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
function Y0(a, i = "/") {
  let {
      pathname: s,
      search: o = "",
      hash: c = "",
    } = typeof a == "string" ? ni(a) : a,
    d;
  return (
    s
      ? ((s = s.replace(/\/\/+/g, "/")),
        s.startsWith("/") ? (d = vg(s.substring(1), "/")) : (d = vg(s, i)))
      : (d = i),
    { pathname: d, search: X0(o), hash: Q0(c) }
  );
}
function vg(a, i) {
  let s = i.replace(/\/+$/, "").split("/");
  return (
    a.split("/").forEach((c) => {
      c === ".." ? s.length > 1 && s.pop() : c !== "." && s.push(c);
    }),
    s.length > 1 ? s.join("/") : "/"
  );
}
function vc(a, i, s, o) {
  return `Cannot include a '${a}' character in a manually specified \`to.${i}\` field [${JSON.stringify(o)}].  Please separate it out to the \`to.${s}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
}
function q0(a) {
  return a.filter(
    (i, s) => s === 0 || (i.route.path && i.route.path.length > 0),
  );
}
function ip(a) {
  let i = q0(a);
  return i.map((s, o) => (o === i.length - 1 ? s.pathname : s.pathnameBase));
}
function Lc(a, i, s, o = !1) {
  let c;
  typeof a == "string"
    ? (c = ni(a))
    : ((c = { ...a }),
      Xe(
        !c.pathname || !c.pathname.includes("?"),
        vc("?", "pathname", "search", c),
      ),
      Xe(
        !c.pathname || !c.pathname.includes("#"),
        vc("#", "pathname", "hash", c),
      ),
      Xe(!c.search || !c.search.includes("#"), vc("#", "search", "hash", c)));
  let d = a === "" || c.pathname === "",
    h = d ? "/" : c.pathname,
    v;
  if (h == null) v = s;
  else {
    let p = i.length - 1;
    if (!o && h.startsWith("..")) {
      let N = h.split("/");
      for (; N[0] === ".."; ) (N.shift(), (p -= 1));
      c.pathname = N.join("/");
    }
    v = p >= 0 ? i[p] : "/";
  }
  let y = Y0(c, v),
    g = h && h !== "/" && h.endsWith("/"),
    S = (d || h === ".") && s.endsWith("/");
  return (!y.pathname.endsWith("/") && (g || S) && (y.pathname += "/"), y);
}
var En = (a) => a.join("/").replace(/\/\/+/g, "/"),
  V0 = (a) => a.replace(/\/+$/, "").replace(/^\/*/, "/"),
  X0 = (a) => (!a || a === "?" ? "" : a.startsWith("?") ? a : "?" + a),
  Q0 = (a) => (!a || a === "#" ? "" : a.startsWith("#") ? a : "#" + a),
  Z0 = class {
    constructor(a, i, s, o = !1) {
      ((this.status = a),
        (this.statusText = i || ""),
        (this.internal = o),
        s instanceof Error
          ? ((this.data = s.toString()), (this.error = s))
          : (this.data = s));
    }
  };
function K0(a) {
  return (
    a != null &&
    typeof a.status == "number" &&
    typeof a.statusText == "string" &&
    typeof a.internal == "boolean" &&
    "data" in a
  );
}
function J0(a) {
  return (
    a
      .map((i) => i.route.path)
      .filter(Boolean)
      .join("/")
      .replace(/\/\/*/g, "/") || "/"
  );
}
var rp =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
function sp(a, i) {
  let s = a;
  if (typeof s != "string" || !G0.test(s))
    return { absoluteURL: void 0, isExternal: !1, to: s };
  let o = s,
    c = !1;
  if (rp)
    try {
      let d = new URL(window.location.href),
        h = s.startsWith("//") ? new URL(d.protocol + s) : new URL(s),
        v = Zn(h.pathname, i);
      h.origin === d.origin && v != null
        ? (s = v + h.search + h.hash)
        : (c = !0);
    } catch {
      wn(
        !1,
        `<Link to="${s}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`,
      );
    }
  return { absoluteURL: o, isExternal: c, to: s };
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
var op = ["POST", "PUT", "PATCH", "DELETE"];
new Set(op);
var $0 = ["GET", ...op];
new Set($0);
var ai = b.createContext(null);
ai.displayName = "DataRouter";
var Qs = b.createContext(null);
Qs.displayName = "DataRouterState";
var up = b.createContext(!1);
function F0() {
  return b.useContext(up);
}
var cp = b.createContext({ isTransitioning: !1 });
cp.displayName = "ViewTransition";
var W0 = b.createContext(new Map());
W0.displayName = "Fetchers";
var I0 = b.createContext(null);
I0.displayName = "Await";
var sn = b.createContext(null);
sn.displayName = "Navigation";
var sr = b.createContext(null);
sr.displayName = "Location";
var Fn = b.createContext({ outlet: null, matches: [], isDataRoute: !1 });
Fn.displayName = "Route";
var Bc = b.createContext(null);
Bc.displayName = "RouteError";
var fp = "REACT_ROUTER_ERROR",
  P0 = "REDIRECT",
  ex = "ROUTE_ERROR_RESPONSE";
function tx(a) {
  if (a.startsWith(`${fp}:${P0}:{`))
    try {
      let i = JSON.parse(a.slice(28));
      if (
        typeof i == "object" &&
        i &&
        typeof i.status == "number" &&
        typeof i.statusText == "string" &&
        typeof i.location == "string" &&
        typeof i.reloadDocument == "boolean" &&
        typeof i.replace == "boolean"
      )
        return i;
    } catch {}
}
function nx(a) {
  if (a.startsWith(`${fp}:${ex}:{`))
    try {
      let i = JSON.parse(a.slice(40));
      if (
        typeof i == "object" &&
        i &&
        typeof i.status == "number" &&
        typeof i.statusText == "string"
      )
        return new Z0(i.status, i.statusText, i.data);
    } catch {}
}
function ax(a, { relative: i } = {}) {
  Xe(
    or(),
    "useHref() may be used only in the context of a <Router> component.",
  );
  let { basename: s, navigator: o } = b.useContext(sn),
    { hash: c, pathname: d, search: h } = ur(a, { relative: i }),
    v = d;
  return (
    s !== "/" && (v = d === "/" ? s : En([s, d])),
    o.createHref({ pathname: v, search: h, hash: c })
  );
}
function or() {
  return b.useContext(sr) != null;
}
function Wn() {
  return (
    Xe(
      or(),
      "useLocation() may be used only in the context of a <Router> component.",
    ),
    b.useContext(sr).location
  );
}
var dp =
  "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
function mp(a) {
  b.useContext(sn).static || b.useLayoutEffect(a);
}
function Zs() {
  let { isDataRoute: a } = b.useContext(Fn);
  return a ? px() : lx();
}
function lx() {
  Xe(
    or(),
    "useNavigate() may be used only in the context of a <Router> component.",
  );
  let a = b.useContext(ai),
    { basename: i, navigator: s } = b.useContext(sn),
    { matches: o } = b.useContext(Fn),
    { pathname: c } = Wn(),
    d = JSON.stringify(ip(o)),
    h = b.useRef(!1);
  return (
    mp(() => {
      h.current = !0;
    }),
    b.useCallback(
      (y, g = {}) => {
        if ((wn(h.current, dp), !h.current)) return;
        if (typeof y == "number") {
          s.go(y);
          return;
        }
        let S = Lc(y, JSON.parse(d), c, g.relative === "path");
        (a == null &&
          i !== "/" &&
          (S.pathname = S.pathname === "/" ? i : En([i, S.pathname])),
          (g.replace ? s.replace : s.push)(S, g.state, g));
      },
      [i, s, d, c, a],
    )
  );
}
b.createContext(null);
function ur(a, { relative: i } = {}) {
  let { matches: s } = b.useContext(Fn),
    { pathname: o } = Wn(),
    c = JSON.stringify(ip(s));
  return b.useMemo(() => Lc(a, JSON.parse(c), o, i === "path"), [a, c, o, i]);
}
function ix(a, i) {
  return hp(a, i);
}
function hp(a, i, s) {
  Xe(
    or(),
    "useRoutes() may be used only in the context of a <Router> component.",
  );
  let { navigator: o } = b.useContext(sn),
    { matches: c } = b.useContext(Fn),
    d = c[c.length - 1],
    h = d ? d.params : {},
    v = d ? d.pathname : "/",
    y = d ? d.pathnameBase : "/",
    g = d && d.route;
  {
    let _ = (g && g.path) || "";
    pp(
      v,
      !g || _.endsWith("*") || _.endsWith("*?"),
      `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${v}" (under <Route path="${_}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${_}"> to <Route path="${_ === "/" ? "*" : `${_}/*`}">.`,
    );
  }
  let S = Wn(),
    p;
  if (i) {
    let _ = typeof i == "string" ? ni(i) : i;
    (Xe(
      y === "/" || _.pathname?.startsWith(y),
      `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${y}" but pathname "${_.pathname}" was given in the \`location\` prop.`,
    ),
      (p = _));
  } else p = S;
  let N = p.pathname || "/",
    z = N;
  if (y !== "/") {
    let _ = y.replace(/^\//, "").split("/");
    z = "/" + N.replace(/^\//, "").split("/").slice(_.length).join("/");
  }
  let A = np(a, { pathname: z });
  (wn(
    g || A != null,
    `No routes matched location "${p.pathname}${p.search}${p.hash}" `,
  ),
    wn(
      A == null ||
        A[A.length - 1].route.element !== void 0 ||
        A[A.length - 1].route.Component !== void 0 ||
        A[A.length - 1].route.lazy !== void 0,
      `Matched leaf route at location "${p.pathname}${p.search}${p.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`,
    ));
  let E = cx(
    A &&
      A.map((_) =>
        Object.assign({}, _, {
          params: Object.assign({}, h, _.params),
          pathname: En([
            y,
            o.encodeLocation
              ? o.encodeLocation(
                  _.pathname
                    .replace(/%/g, "%25")
                    .replace(/\?/g, "%3F")
                    .replace(/#/g, "%23"),
                ).pathname
              : _.pathname,
          ]),
          pathnameBase:
            _.pathnameBase === "/"
              ? y
              : En([
                  y,
                  o.encodeLocation
                    ? o.encodeLocation(
                        _.pathnameBase
                          .replace(/%/g, "%25")
                          .replace(/\?/g, "%3F")
                          .replace(/#/g, "%23"),
                      ).pathname
                    : _.pathnameBase,
                ]),
        }),
      ),
    c,
    s,
  );
  return i && E
    ? b.createElement(
        sr.Provider,
        {
          value: {
            location: {
              pathname: "/",
              search: "",
              hash: "",
              state: null,
              key: "default",
              unstable_mask: void 0,
              ...p,
            },
            navigationType: "POP",
          },
        },
        E,
      )
    : E;
}
function rx() {
  let a = gx(),
    i = K0(a)
      ? `${a.status} ${a.statusText}`
      : a instanceof Error
        ? a.message
        : JSON.stringify(a),
    s = a instanceof Error ? a.stack : null,
    o = "rgba(200,200,200, 0.5)",
    c = { padding: "0.5rem", backgroundColor: o },
    d = { padding: "2px 4px", backgroundColor: o },
    h = null;
  return (
    console.error("Error handled by React Router default ErrorBoundary:", a),
    (h = b.createElement(
      b.Fragment,
      null,
      b.createElement("p", null, "💿 Hey developer 👋"),
      b.createElement(
        "p",
        null,
        "You can provide a way better UX than this when your app throws errors by providing your own ",
        b.createElement("code", { style: d }, "ErrorBoundary"),
        " or",
        " ",
        b.createElement("code", { style: d }, "errorElement"),
        " prop on your route.",
      ),
    )),
    b.createElement(
      b.Fragment,
      null,
      b.createElement("h2", null, "Unexpected Application Error!"),
      b.createElement("h3", { style: { fontStyle: "italic" } }, i),
      s ? b.createElement("pre", { style: c }, s) : null,
      h,
    )
  );
}
var sx = b.createElement(rx, null),
  gp = class extends b.Component {
    constructor(a) {
      (super(a),
        (this.state = {
          location: a.location,
          revalidation: a.revalidation,
          error: a.error,
        }));
    }
    static getDerivedStateFromError(a) {
      return { error: a };
    }
    static getDerivedStateFromProps(a, i) {
      return i.location !== a.location ||
        (i.revalidation !== "idle" && a.revalidation === "idle")
        ? { error: a.error, location: a.location, revalidation: a.revalidation }
        : {
            error: a.error !== void 0 ? a.error : i.error,
            location: i.location,
            revalidation: a.revalidation || i.revalidation,
          };
    }
    componentDidCatch(a, i) {
      this.props.onError
        ? this.props.onError(a, i)
        : console.error(
            "React Router caught the following error during render",
            a,
          );
    }
    render() {
      let a = this.state.error;
      if (
        this.context &&
        typeof a == "object" &&
        a &&
        "digest" in a &&
        typeof a.digest == "string"
      ) {
        const s = nx(a.digest);
        s && (a = s);
      }
      let i =
        a !== void 0
          ? b.createElement(
              Fn.Provider,
              { value: this.props.routeContext },
              b.createElement(Bc.Provider, {
                value: a,
                children: this.props.component,
              }),
            )
          : this.props.children;
      return this.context ? b.createElement(ox, { error: a }, i) : i;
    }
  };
gp.contextType = up;
var bc = new WeakMap();
function ox({ children: a, error: i }) {
  let { basename: s } = b.useContext(sn);
  if (
    typeof i == "object" &&
    i &&
    "digest" in i &&
    typeof i.digest == "string"
  ) {
    let o = tx(i.digest);
    if (o) {
      let c = bc.get(i);
      if (c) throw c;
      let d = sp(o.location, s);
      if (rp && !bc.get(i))
        if (d.isExternal || o.reloadDocument)
          window.location.href = d.absoluteURL || d.to;
        else {
          const h = Promise.resolve().then(() =>
            window.__reactRouterDataRouter.navigate(d.to, {
              replace: o.replace,
            }),
          );
          throw (bc.set(i, h), h);
        }
      return b.createElement("meta", {
        httpEquiv: "refresh",
        content: `0;url=${d.absoluteURL || d.to}`,
      });
    }
  }
  return a;
}
function ux({ routeContext: a, match: i, children: s }) {
  let o = b.useContext(ai);
  return (
    o &&
      o.static &&
      o.staticContext &&
      (i.route.errorElement || i.route.ErrorBoundary) &&
      (o.staticContext._deepestRenderedBoundaryId = i.route.id),
    b.createElement(Fn.Provider, { value: a }, s)
  );
}
function cx(a, i = [], s) {
  let o = s?.state;
  if (a == null) {
    if (!o) return null;
    if (o.errors) a = o.matches;
    else if (i.length === 0 && !o.initialized && o.matches.length > 0)
      a = o.matches;
    else return null;
  }
  let c = a,
    d = o?.errors;
  if (d != null) {
    let S = c.findIndex((p) => p.route.id && d?.[p.route.id] !== void 0);
    (Xe(
      S >= 0,
      `Could not find a matching route for errors on route IDs: ${Object.keys(d).join(",")}`,
    ),
      (c = c.slice(0, Math.min(c.length, S + 1))));
  }
  let h = !1,
    v = -1;
  if (s && o) {
    h = o.renderFallback;
    for (let S = 0; S < c.length; S++) {
      let p = c[S];
      if (
        ((p.route.HydrateFallback || p.route.hydrateFallbackElement) && (v = S),
        p.route.id)
      ) {
        let { loaderData: N, errors: z } = o,
          A =
            p.route.loader &&
            !N.hasOwnProperty(p.route.id) &&
            (!z || z[p.route.id] === void 0);
        if (p.route.lazy || A) {
          (s.isStatic && (h = !0),
            v >= 0 ? (c = c.slice(0, v + 1)) : (c = [c[0]]));
          break;
        }
      }
    }
  }
  let y = s?.onError,
    g =
      o && y
        ? (S, p) => {
            y(S, {
              location: o.location,
              params: o.matches?.[0]?.params ?? {},
              unstable_pattern: J0(o.matches),
              errorInfo: p,
            });
          }
        : void 0;
  return c.reduceRight((S, p, N) => {
    let z,
      A = !1,
      E = null,
      _ = null;
    o &&
      ((z = d && p.route.id ? d[p.route.id] : void 0),
      (E = p.route.errorElement || sx),
      h &&
        (v < 0 && N === 0
          ? (pp(
              "route-fallback",
              !1,
              "No `HydrateFallback` element provided to render during initial hydration",
            ),
            (A = !0),
            (_ = null))
          : v === N &&
            ((A = !0), (_ = p.route.hydrateFallbackElement || null))));
    let C = i.concat(c.slice(0, N + 1)),
      X = () => {
        let L;
        return (
          z
            ? (L = E)
            : A
              ? (L = _)
              : p.route.Component
                ? (L = b.createElement(p.route.Component, null))
                : p.route.element
                  ? (L = p.route.element)
                  : (L = S),
          b.createElement(ux, {
            match: p,
            routeContext: { outlet: S, matches: C, isDataRoute: o != null },
            children: L,
          })
        );
      };
    return o && (p.route.ErrorBoundary || p.route.errorElement || N === 0)
      ? b.createElement(gp, {
          location: o.location,
          revalidation: o.revalidation,
          component: E,
          error: z,
          children: X(),
          routeContext: { outlet: null, matches: C, isDataRoute: !0 },
          onError: g,
        })
      : X();
  }, null);
}
function Hc(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function fx(a) {
  let i = b.useContext(ai);
  return (Xe(i, Hc(a)), i);
}
function dx(a) {
  let i = b.useContext(Qs);
  return (Xe(i, Hc(a)), i);
}
function mx(a) {
  let i = b.useContext(Fn);
  return (Xe(i, Hc(a)), i);
}
function Gc(a) {
  let i = mx(a),
    s = i.matches[i.matches.length - 1];
  return (
    Xe(
      s.route.id,
      `${a} can only be used on routes that contain a unique "id"`,
    ),
    s.route.id
  );
}
function hx() {
  return Gc("useRouteId");
}
function gx() {
  let a = b.useContext(Bc),
    i = dx("useRouteError"),
    s = Gc("useRouteError");
  return a !== void 0 ? a : i.errors?.[s];
}
function px() {
  let { router: a } = fx("useNavigate"),
    i = Gc("useNavigate"),
    s = b.useRef(!1);
  return (
    mp(() => {
      s.current = !0;
    }),
    b.useCallback(
      async (c, d = {}) => {
        (wn(s.current, dp),
          s.current &&
            (typeof c == "number"
              ? await a.navigate(c)
              : await a.navigate(c, { fromRouteId: i, ...d })));
      },
      [a, i],
    )
  );
}
var bg = {};
function pp(a, i, s) {
  !i && !bg[a] && ((bg[a] = !0), wn(!1, s));
}
b.memo(vx);
function vx({ routes: a, future: i, state: s, isStatic: o, onError: c }) {
  return hp(a, void 0, { state: s, isStatic: o, onError: c });
}
function ks(a) {
  Xe(
    !1,
    "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.",
  );
}
function bx({
  basename: a = "/",
  children: i = null,
  location: s,
  navigationType: o = "POP",
  navigator: c,
  static: d = !1,
  unstable_useTransitions: h,
}) {
  Xe(
    !or(),
    "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.",
  );
  let v = a.replace(/^\/*/, "/"),
    y = b.useMemo(
      () => ({
        basename: v,
        navigator: c,
        static: d,
        unstable_useTransitions: h,
        future: {},
      }),
      [v, c, d, h],
    );
  typeof s == "string" && (s = ni(s));
  let {
      pathname: g = "/",
      search: S = "",
      hash: p = "",
      state: N = null,
      key: z = "default",
      unstable_mask: A,
    } = s,
    E = b.useMemo(() => {
      let _ = Zn(g, v);
      return _ == null
        ? null
        : {
            location: {
              pathname: _,
              search: S,
              hash: p,
              state: N,
              key: z,
              unstable_mask: A,
            },
            navigationType: o,
          };
    }, [v, g, S, p, N, z, o, A]);
  return (
    wn(
      E != null,
      `<Router basename="${v}"> is not able to match the URL "${g}${S}${p}" because it does not start with the basename, so the <Router> won't render anything.`,
    ),
    E == null
      ? null
      : b.createElement(
          sn.Provider,
          { value: y },
          b.createElement(sr.Provider, { children: i, value: E }),
        )
  );
}
function yx({ children: a, location: i }) {
  return ix(Rc(a), i);
}
function Rc(a, i = []) {
  let s = [];
  return (
    b.Children.forEach(a, (o, c) => {
      if (!b.isValidElement(o)) return;
      let d = [...i, c];
      if (o.type === b.Fragment) {
        s.push.apply(s, Rc(o.props.children, d));
        return;
      }
      (Xe(
        o.type === ks,
        `[${typeof o.type == "string" ? o.type : o.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`,
      ),
        Xe(
          !o.props.index || !o.props.children,
          "An index route cannot have child routes.",
        ));
      let h = {
        id: o.props.id || d.join("-"),
        caseSensitive: o.props.caseSensitive,
        element: o.props.element,
        Component: o.props.Component,
        index: o.props.index,
        path: o.props.path,
        middleware: o.props.middleware,
        loader: o.props.loader,
        action: o.props.action,
        hydrateFallbackElement: o.props.hydrateFallbackElement,
        HydrateFallback: o.props.HydrateFallback,
        errorElement: o.props.errorElement,
        ErrorBoundary: o.props.ErrorBoundary,
        hasErrorBoundary:
          o.props.hasErrorBoundary === !0 ||
          o.props.ErrorBoundary != null ||
          o.props.errorElement != null,
        shouldRevalidate: o.props.shouldRevalidate,
        handle: o.props.handle,
        lazy: o.props.lazy,
      };
      (o.props.children && (h.children = Rc(o.props.children, d)), s.push(h));
    }),
    s
  );
}
var Us = "get",
  Ls = "application/x-www-form-urlencoded";
function Ks(a) {
  return typeof HTMLElement < "u" && a instanceof HTMLElement;
}
function xx(a) {
  return Ks(a) && a.tagName.toLowerCase() === "button";
}
function Sx(a) {
  return Ks(a) && a.tagName.toLowerCase() === "form";
}
function Ex(a) {
  return Ks(a) && a.tagName.toLowerCase() === "input";
}
function wx(a) {
  return !!(a.metaKey || a.altKey || a.ctrlKey || a.shiftKey);
}
function Nx(a, i) {
  return a.button === 0 && (!i || i === "_self") && !wx(a);
}
var js = null;
function _x() {
  if (js === null)
    try {
      (new FormData(document.createElement("form"), 0), (js = !1));
    } catch {
      js = !0;
    }
  return js;
}
var jx = new Set([
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain",
]);
function yc(a) {
  return a != null && !jx.has(a)
    ? (wn(
        !1,
        `"${a}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Ls}"`,
      ),
      null)
    : a;
}
function Tx(a, i) {
  let s, o, c, d, h;
  if (Sx(a)) {
    let v = a.getAttribute("action");
    ((o = v ? Zn(v, i) : null),
      (s = a.getAttribute("method") || Us),
      (c = yc(a.getAttribute("enctype")) || Ls),
      (d = new FormData(a)));
  } else if (xx(a) || (Ex(a) && (a.type === "submit" || a.type === "image"))) {
    let v = a.form;
    if (v == null)
      throw new Error(
        'Cannot submit a <button> or <input type="submit"> without a <form>',
      );
    let y = a.getAttribute("formaction") || v.getAttribute("action");
    if (
      ((o = y ? Zn(y, i) : null),
      (s = a.getAttribute("formmethod") || v.getAttribute("method") || Us),
      (c =
        yc(a.getAttribute("formenctype")) ||
        yc(v.getAttribute("enctype")) ||
        Ls),
      (d = new FormData(v, a)),
      !_x())
    ) {
      let { name: g, type: S, value: p } = a;
      if (S === "image") {
        let N = g ? `${g}.` : "";
        (d.append(`${N}x`, "0"), d.append(`${N}y`, "0"));
      } else g && d.append(g, p);
    }
  } else {
    if (Ks(a))
      throw new Error(
        'Cannot submit element that is not <form>, <button>, or <input type="submit|image">',
      );
    ((s = Us), (o = null), (c = Ls), (h = a));
  }
  return (
    d && c === "text/plain" && ((h = d), (d = void 0)),
    { action: o, method: s.toLowerCase(), encType: c, formData: d, body: h }
  );
}
Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function Yc(a, i) {
  if (a === !1 || a === null || typeof a > "u") throw new Error(i);
}
function vp(a, i, s, o) {
  let c =
    typeof a == "string"
      ? new URL(
          a,
          typeof window > "u"
            ? "server://singlefetch/"
            : window.location.origin,
        )
      : a;
  return (
    s
      ? c.pathname.endsWith("/")
        ? (c.pathname = `${c.pathname}_.${o}`)
        : (c.pathname = `${c.pathname}.${o}`)
      : c.pathname === "/"
        ? (c.pathname = `_root.${o}`)
        : i && Zn(c.pathname, i) === "/"
          ? (c.pathname = `${i.replace(/\/$/, "")}/_root.${o}`)
          : (c.pathname = `${c.pathname.replace(/\/$/, "")}.${o}`),
    c
  );
}
async function Cx(a, i) {
  if (a.id in i) return i[a.id];
  try {
    let s = await import(a.module);
    return ((i[a.id] = s), s);
  } catch (s) {
    return (
      console.error(
        `Error loading route module \`${a.module}\`, reloading page...`,
      ),
      console.error(s),
      window.__reactRouterContext && window.__reactRouterContext.isSpaMode,
      window.location.reload(),
      new Promise(() => {})
    );
  }
}
function Ax(a) {
  return a == null
    ? !1
    : a.href == null
      ? a.rel === "preload" &&
        typeof a.imageSrcSet == "string" &&
        typeof a.imageSizes == "string"
      : typeof a.rel == "string" && typeof a.href == "string";
}
async function Rx(a, i, s) {
  let o = await Promise.all(
    a.map(async (c) => {
      let d = i.routes[c.route.id];
      if (d) {
        let h = await Cx(d, s);
        return h.links ? h.links() : [];
      }
      return [];
    }),
  );
  return Ox(
    o
      .flat(1)
      .filter(Ax)
      .filter((c) => c.rel === "stylesheet" || c.rel === "preload")
      .map((c) =>
        c.rel === "stylesheet"
          ? { ...c, rel: "prefetch", as: "style" }
          : { ...c, rel: "prefetch" },
      ),
  );
}
function yg(a, i, s, o, c, d) {
  let h = (y, g) => (s[g] ? y.route.id !== s[g].route.id : !0),
    v = (y, g) =>
      s[g].pathname !== y.pathname ||
      (s[g].route.path?.endsWith("*") && s[g].params["*"] !== y.params["*"]);
  return d === "assets"
    ? i.filter((y, g) => h(y, g) || v(y, g))
    : d === "data"
      ? i.filter((y, g) => {
          let S = o.routes[y.route.id];
          if (!S || !S.hasLoader) return !1;
          if (h(y, g) || v(y, g)) return !0;
          if (y.route.shouldRevalidate) {
            let p = y.route.shouldRevalidate({
              currentUrl: new URL(
                c.pathname + c.search + c.hash,
                window.origin,
              ),
              currentParams: s[0]?.params || {},
              nextUrl: new URL(a, window.origin),
              nextParams: y.params,
              defaultShouldRevalidate: !0,
            });
            if (typeof p == "boolean") return p;
          }
          return !0;
        })
      : [];
}
function zx(a, i, { includeHydrateFallback: s } = {}) {
  return Mx(
    a
      .map((o) => {
        let c = i.routes[o.route.id];
        if (!c) return [];
        let d = [c.module];
        return (
          c.clientActionModule && (d = d.concat(c.clientActionModule)),
          c.clientLoaderModule && (d = d.concat(c.clientLoaderModule)),
          s &&
            c.hydrateFallbackModule &&
            (d = d.concat(c.hydrateFallbackModule)),
          c.imports && (d = d.concat(c.imports)),
          d
        );
      })
      .flat(1),
  );
}
function Mx(a) {
  return [...new Set(a)];
}
function Dx(a) {
  let i = {},
    s = Object.keys(a).sort();
  for (let o of s) i[o] = a[o];
  return i;
}
function Ox(a, i) {
  let s = new Set();
  return (
    new Set(i),
    a.reduce((o, c) => {
      let d = JSON.stringify(Dx(c));
      return (s.has(d) || (s.add(d), o.push({ key: d, link: c })), o);
    }, [])
  );
}
function qc() {
  let a = b.useContext(ai);
  return (
    Yc(
      a,
      "You must render this element inside a <DataRouterContext.Provider> element",
    ),
    a
  );
}
function kx() {
  let a = b.useContext(Qs);
  return (
    Yc(
      a,
      "You must render this element inside a <DataRouterStateContext.Provider> element",
    ),
    a
  );
}
var Vc = b.createContext(void 0);
Vc.displayName = "FrameworkContext";
function Xc() {
  let a = b.useContext(Vc);
  return (
    Yc(a, "You must render this element inside a <HydratedRouter> element"),
    a
  );
}
function Ux(a, i) {
  let s = b.useContext(Vc),
    [o, c] = b.useState(!1),
    [d, h] = b.useState(!1),
    {
      onFocus: v,
      onBlur: y,
      onMouseEnter: g,
      onMouseLeave: S,
      onTouchStart: p,
    } = i,
    N = b.useRef(null);
  (b.useEffect(() => {
    if ((a === "render" && h(!0), a === "viewport")) {
      let E = (C) => {
          C.forEach((X) => {
            h(X.isIntersecting);
          });
        },
        _ = new IntersectionObserver(E, { threshold: 0.5 });
      return (
        N.current && _.observe(N.current),
        () => {
          _.disconnect();
        }
      );
    }
  }, [a]),
    b.useEffect(() => {
      if (o) {
        let E = setTimeout(() => {
          h(!0);
        }, 100);
        return () => {
          clearTimeout(E);
        };
      }
    }, [o]));
  let z = () => {
      c(!0);
    },
    A = () => {
      (c(!1), h(!1));
    };
  return s
    ? a !== "intent"
      ? [d, N, {}]
      : [
          d,
          N,
          {
            onFocus: tr(v, z),
            onBlur: tr(y, A),
            onMouseEnter: tr(g, z),
            onMouseLeave: tr(S, A),
            onTouchStart: tr(p, z),
          },
        ]
    : [!1, N, {}];
}
function tr(a, i) {
  return (s) => {
    (a && a(s), s.defaultPrevented || i(s));
  };
}
function Lx({ page: a, ...i }) {
  let s = F0(),
    { router: o } = qc(),
    c = b.useMemo(() => np(o.routes, a, o.basename), [o.routes, a, o.basename]);
  return c
    ? s
      ? b.createElement(Hx, { page: a, matches: c, ...i })
      : b.createElement(Gx, { page: a, matches: c, ...i })
    : null;
}
function Bx(a) {
  let { manifest: i, routeModules: s } = Xc(),
    [o, c] = b.useState([]);
  return (
    b.useEffect(() => {
      let d = !1;
      return (
        Rx(a, i, s).then((h) => {
          d || c(h);
        }),
        () => {
          d = !0;
        }
      );
    }, [a, i, s]),
    o
  );
}
function Hx({ page: a, matches: i, ...s }) {
  let o = Wn(),
    { future: c } = Xc(),
    { basename: d } = qc(),
    h = b.useMemo(() => {
      if (a === o.pathname + o.search + o.hash) return [];
      let v = vp(a, d, c.unstable_trailingSlashAwareDataRequests, "rsc"),
        y = !1,
        g = [];
      for (let S of i)
        typeof S.route.shouldRevalidate == "function"
          ? (y = !0)
          : g.push(S.route.id);
      return (
        y && g.length > 0 && v.searchParams.set("_routes", g.join(",")),
        [v.pathname + v.search]
      );
    }, [d, c.unstable_trailingSlashAwareDataRequests, a, o, i]);
  return b.createElement(
    b.Fragment,
    null,
    h.map((v) =>
      b.createElement("link", {
        key: v,
        rel: "prefetch",
        as: "fetch",
        href: v,
        ...s,
      }),
    ),
  );
}
function Gx({ page: a, matches: i, ...s }) {
  let o = Wn(),
    { future: c, manifest: d, routeModules: h } = Xc(),
    { basename: v } = qc(),
    { loaderData: y, matches: g } = kx(),
    S = b.useMemo(() => yg(a, i, g, d, o, "data"), [a, i, g, d, o]),
    p = b.useMemo(() => yg(a, i, g, d, o, "assets"), [a, i, g, d, o]),
    N = b.useMemo(() => {
      if (a === o.pathname + o.search + o.hash) return [];
      let E = new Set(),
        _ = !1;
      if (
        (i.forEach((X) => {
          let L = d.routes[X.route.id];
          !L ||
            !L.hasLoader ||
            ((!S.some((F) => F.route.id === X.route.id) &&
              X.route.id in y &&
              h[X.route.id]?.shouldRevalidate) ||
            L.hasClientLoader
              ? (_ = !0)
              : E.add(X.route.id));
        }),
        E.size === 0)
      )
        return [];
      let C = vp(a, v, c.unstable_trailingSlashAwareDataRequests, "data");
      return (
        _ &&
          E.size > 0 &&
          C.searchParams.set(
            "_routes",
            i
              .filter((X) => E.has(X.route.id))
              .map((X) => X.route.id)
              .join(","),
          ),
        [C.pathname + C.search]
      );
    }, [v, c.unstable_trailingSlashAwareDataRequests, y, o, d, S, i, a, h]),
    z = b.useMemo(() => zx(p, d), [p, d]),
    A = Bx(p);
  return b.createElement(
    b.Fragment,
    null,
    N.map((E) =>
      b.createElement("link", {
        key: E,
        rel: "prefetch",
        as: "fetch",
        href: E,
        ...s,
      }),
    ),
    z.map((E) =>
      b.createElement("link", { key: E, rel: "modulepreload", href: E, ...s }),
    ),
    A.map(({ key: E, link: _ }) =>
      b.createElement("link", {
        key: E,
        nonce: s.nonce,
        ..._,
        crossOrigin: _.crossOrigin ?? s.crossOrigin,
      }),
    ),
  );
}
function Yx(...a) {
  return (i) => {
    a.forEach((s) => {
      typeof s == "function" ? s(i) : s != null && (s.current = i);
    });
  };
}
var qx =
  typeof window < "u" &&
  typeof window.document < "u" &&
  typeof window.document.createElement < "u";
try {
  qx && (window.__reactRouterVersion = "7.14.0");
} catch {}
function Vx({
  basename: a,
  children: i,
  unstable_useTransitions: s,
  window: o,
}) {
  let c = b.useRef();
  c.current == null && (c.current = w0({ window: o, v5Compat: !0 }));
  let d = c.current,
    [h, v] = b.useState({ action: d.action, location: d.location }),
    y = b.useCallback(
      (g) => {
        s === !1 ? v(g) : b.startTransition(() => v(g));
      },
      [s],
    );
  return (
    b.useLayoutEffect(() => d.listen(y), [d, y]),
    b.createElement(bx, {
      basename: a,
      children: i,
      location: h.location,
      navigationType: h.action,
      navigator: d,
      unstable_useTransitions: s,
    })
  );
}
var bp = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Il = b.forwardRef(function (
    {
      onClick: i,
      discover: s = "render",
      prefetch: o = "none",
      relative: c,
      reloadDocument: d,
      replace: h,
      unstable_mask: v,
      state: y,
      target: g,
      to: S,
      preventScrollReset: p,
      viewTransition: N,
      unstable_defaultShouldRevalidate: z,
      ...A
    },
    E,
  ) {
    let {
        basename: _,
        navigator: C,
        unstable_useTransitions: X,
      } = b.useContext(sn),
      L = typeof S == "string" && bp.test(S),
      F = sp(S, _);
    S = F.to;
    let H = ax(S, { relative: c }),
      J = Wn(),
      B = null;
    if (v) {
      let je = Lc(v, [], J.unstable_mask ? J.unstable_mask.pathname : "/", !0);
      (_ !== "/" &&
        (je.pathname = je.pathname === "/" ? _ : En([_, je.pathname])),
        (B = C.createHref(je)));
    }
    let [Y, ee, ye] = Ux(o, A),
      pe = Kx(S, {
        replace: h,
        unstable_mask: v,
        state: y,
        target: g,
        preventScrollReset: p,
        relative: c,
        viewTransition: N,
        unstable_defaultShouldRevalidate: z,
        unstable_useTransitions: X,
      });
    function Ee(je) {
      (i && i(je), je.defaultPrevented || pe(je));
    }
    let Le = !(F.isExternal || d),
      Qe = b.createElement("a", {
        ...A,
        ...ye,
        href: (Le ? B : void 0) || F.absoluteURL || H,
        onClick: Le ? Ee : i,
        ref: Yx(E, ee),
        target: g,
        "data-discover": !L && s === "render" ? "true" : void 0,
      });
    return Y && !L
      ? b.createElement(b.Fragment, null, Qe, b.createElement(Lx, { page: H }))
      : Qe;
  });
Il.displayName = "Link";
var Xx = b.forwardRef(function (
  {
    "aria-current": i = "page",
    caseSensitive: s = !1,
    className: o = "",
    end: c = !1,
    style: d,
    to: h,
    viewTransition: v,
    children: y,
    ...g
  },
  S,
) {
  let p = ur(h, { relative: g.relative }),
    N = Wn(),
    z = b.useContext(Qs),
    { navigator: A, basename: E } = b.useContext(sn),
    _ = z != null && Ix(p) && v === !0,
    C = A.encodeLocation ? A.encodeLocation(p).pathname : p.pathname,
    X = N.pathname,
    L =
      z && z.navigation && z.navigation.location
        ? z.navigation.location.pathname
        : null;
  (s ||
    ((X = X.toLowerCase()),
    (L = L ? L.toLowerCase() : null),
    (C = C.toLowerCase())),
    L && E && (L = Zn(L, E) || L));
  const F = C !== "/" && C.endsWith("/") ? C.length - 1 : C.length;
  let H = X === C || (!c && X.startsWith(C) && X.charAt(F) === "/"),
    J =
      L != null &&
      (L === C || (!c && L.startsWith(C) && L.charAt(C.length) === "/")),
    B = { isActive: H, isPending: J, isTransitioning: _ },
    Y = H ? i : void 0,
    ee;
  typeof o == "function"
    ? (ee = o(B))
    : (ee = [
        o,
        H ? "active" : null,
        J ? "pending" : null,
        _ ? "transitioning" : null,
      ]
        .filter(Boolean)
        .join(" "));
  let ye = typeof d == "function" ? d(B) : d;
  return b.createElement(
    Il,
    {
      ...g,
      "aria-current": Y,
      className: ee,
      ref: S,
      style: ye,
      to: h,
      viewTransition: v,
    },
    typeof y == "function" ? y(B) : y,
  );
});
Xx.displayName = "NavLink";
var Qx = b.forwardRef(
  (
    {
      discover: a = "render",
      fetcherKey: i,
      navigate: s,
      reloadDocument: o,
      replace: c,
      state: d,
      method: h = Us,
      action: v,
      onSubmit: y,
      relative: g,
      preventScrollReset: S,
      viewTransition: p,
      unstable_defaultShouldRevalidate: N,
      ...z
    },
    A,
  ) => {
    let { unstable_useTransitions: E } = b.useContext(sn),
      _ = Fx(),
      C = Wx(v, { relative: g }),
      X = h.toLowerCase() === "get" ? "get" : "post",
      L = typeof v == "string" && bp.test(v),
      F = (H) => {
        if ((y && y(H), H.defaultPrevented)) return;
        H.preventDefault();
        let J = H.nativeEvent.submitter,
          B = J?.getAttribute("formmethod") || h,
          Y = () =>
            _(J || H.currentTarget, {
              fetcherKey: i,
              method: B,
              navigate: s,
              replace: c,
              state: d,
              relative: g,
              preventScrollReset: S,
              viewTransition: p,
              unstable_defaultShouldRevalidate: N,
            });
        E && s !== !1 ? b.startTransition(() => Y()) : Y();
      };
    return b.createElement("form", {
      ref: A,
      method: X,
      action: C,
      onSubmit: o ? y : F,
      ...z,
      "data-discover": !L && a === "render" ? "true" : void 0,
    });
  },
);
Qx.displayName = "Form";
function Zx(a) {
  return `${a} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
}
function yp(a) {
  let i = b.useContext(ai);
  return (Xe(i, Zx(a)), i);
}
function Kx(
  a,
  {
    target: i,
    replace: s,
    unstable_mask: o,
    state: c,
    preventScrollReset: d,
    relative: h,
    viewTransition: v,
    unstable_defaultShouldRevalidate: y,
    unstable_useTransitions: g,
  } = {},
) {
  let S = Zs(),
    p = Wn(),
    N = ur(a, { relative: h });
  return b.useCallback(
    (z) => {
      if (Nx(z, i)) {
        z.preventDefault();
        let A = s !== void 0 ? s : lr(p) === lr(N),
          E = () =>
            S(a, {
              replace: A,
              unstable_mask: o,
              state: c,
              preventScrollReset: d,
              relative: h,
              viewTransition: v,
              unstable_defaultShouldRevalidate: y,
            });
        g ? b.startTransition(() => E()) : E();
      }
    },
    [p, S, N, s, o, c, i, a, d, h, v, y, g],
  );
}
var Jx = 0,
  $x = () => `__${String(++Jx)}__`;
function Fx() {
  let { router: a } = yp("useSubmit"),
    { basename: i } = b.useContext(sn),
    s = hx(),
    o = a.fetch,
    c = a.navigate;
  return b.useCallback(
    async (d, h = {}) => {
      let { action: v, method: y, encType: g, formData: S, body: p } = Tx(d, i);
      if (h.navigate === !1) {
        let N = h.fetcherKey || $x();
        await o(N, s, h.action || v, {
          unstable_defaultShouldRevalidate: h.unstable_defaultShouldRevalidate,
          preventScrollReset: h.preventScrollReset,
          formData: S,
          body: p,
          formMethod: h.method || y,
          formEncType: h.encType || g,
          flushSync: h.flushSync,
        });
      } else
        await c(h.action || v, {
          unstable_defaultShouldRevalidate: h.unstable_defaultShouldRevalidate,
          preventScrollReset: h.preventScrollReset,
          formData: S,
          body: p,
          formMethod: h.method || y,
          formEncType: h.encType || g,
          replace: h.replace,
          state: h.state,
          fromRouteId: s,
          flushSync: h.flushSync,
          viewTransition: h.viewTransition,
        });
    },
    [o, c, i, s],
  );
}
function Wx(a, { relative: i } = {}) {
  let { basename: s } = b.useContext(sn),
    o = b.useContext(Fn);
  Xe(o, "useFormAction must be used inside a RouteContext");
  let [c] = o.matches.slice(-1),
    d = { ...ur(a || ".", { relative: i }) },
    h = Wn();
  if (a == null) {
    d.search = h.search;
    let v = new URLSearchParams(d.search),
      y = v.getAll("index");
    if (y.some((S) => S === "")) {
      (v.delete("index"),
        y.filter((p) => p).forEach((p) => v.append("index", p)));
      let S = v.toString();
      d.search = S ? `?${S}` : "";
    }
  }
  return (
    (!a || a === ".") &&
      c.route.index &&
      (d.search = d.search ? d.search.replace(/^\?/, "?index&") : "?index"),
    s !== "/" && (d.pathname = d.pathname === "/" ? s : En([s, d.pathname])),
    lr(d)
  );
}
function Ix(a, { relative: i } = {}) {
  let s = b.useContext(cp);
  Xe(
    s != null,
    "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?",
  );
  let { basename: o } = yp("useViewTransitionState"),
    c = ur(a, { relative: i });
  if (!s.isTransitioning) return !1;
  let d = Zn(s.currentLocation.pathname, o) || s.currentLocation.pathname,
    h = Zn(s.nextLocation.pathname, o) || s.nextLocation.pathname;
  return Gs(c.pathname, h) != null || Gs(c.pathname, d) != null;
}
var xp = tp();
const Sp = Pg(xp);
const Ep = (...a) =>
  a
    .filter((i, s, o) => !!i && i.trim() !== "" && o.indexOf(i) === s)
    .join(" ")
    .trim();
const Px = (a) => a.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const e1 = (a) =>
  a.replace(/^([A-Z])|[\s-_]+(\w)/g, (i, s, o) =>
    o ? o.toUpperCase() : s.toLowerCase(),
  );
const xg = (a) => {
  const i = e1(a);
  return i.charAt(0).toUpperCase() + i.slice(1);
};
var t1 = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
const n1 = (a) => {
  for (const i in a)
    if (i.startsWith("aria-") || i === "role" || i === "title") return !0;
  return !1;
};
const a1 = b.forwardRef(
  (
    {
      color: a = "currentColor",
      size: i = 24,
      strokeWidth: s = 2,
      absoluteStrokeWidth: o,
      className: c = "",
      children: d,
      iconNode: h,
      ...v
    },
    y,
  ) =>
    b.createElement(
      "svg",
      {
        ref: y,
        ...t1,
        width: i,
        height: i,
        stroke: a,
        strokeWidth: o ? (Number(s) * 24) / Number(i) : s,
        className: Ep("lucide", c),
        ...(!d && !n1(v) && { "aria-hidden": "true" }),
        ...v,
      },
      [
        ...h.map(([g, S]) => b.createElement(g, S)),
        ...(Array.isArray(d) ? d : [d]),
      ],
    ),
);
const We = (a, i) => {
  const s = b.forwardRef(({ className: o, ...c }, d) =>
    b.createElement(a1, {
      ref: d,
      iconNode: i,
      className: Ep(`lucide-${Px(xg(a))}`, `lucide-${a}`, o),
      ...c,
    }),
  );
  return ((s.displayName = xg(a)), s);
};
const l1 = [
    ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
    ["path", { d: "M19 12H5", key: "x3x0zl" }],
  ],
  i1 = We("arrow-left", l1);
const r1 = [
    ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
    ["path", { d: "M20 7H4", key: "zbl0bi" }],
    ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
    ["path", { d: "M4 17h16", key: "g4d7ey" }],
  ],
  wp = We("arrow-right-left", r1);
const s1 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]],
  o1 = We("check", s1);
const u1 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  Np = We("chevron-down", u1);
const c1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]],
  _p = We("chevron-right", c1);
const f1 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
  ],
  d1 = We("circle-alert", f1);
const m1 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
  ],
  jp = We("circle-check", m1);
const h1 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }],
  ],
  g1 = We("circle-x", h1);
const p1 = [
    [
      "polyline",
      { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" },
    ],
    [
      "path",
      {
        d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        key: "oot6mr",
      },
    ],
  ],
  Tp = We("inbox", p1);
const v1 = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }],
  ],
  b1 = We("info", v1);
const y1 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  gt = We("loader-circle", y1);
const x1 = [
    ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
    ["path", { d: "M21 12H9", key: "dn1m92" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ],
  S1 = We("log-out", x1);
const E1 = [
    [
      "path",
      {
        d: "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",
        key: "fuxbkv",
      },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7", key: "1ocrg3" }],
    ["path", { d: "M16 19h6", key: "xwg31i" }],
  ],
  w1 = We("mail-minus", E1);
const N1 = [
    ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
    [
      "rect",
      { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" },
    ],
  ],
  _1 = We("mail", N1);
const j1 = [
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    [
      "path",
      {
        d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
        key: "2d38gg",
      },
    ],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }],
  ],
  T1 = We("octagon-x", j1);
const C1 = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
  Sg = We("plus", C1);
const A1 = [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476",
      },
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
  ],
  R1 = We("save", A1);
const z1 = [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw",
      },
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ],
  M1 = We("settings", z1);
const D1 = [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }],
  ],
  Qc = We("trash-2", D1);
const O1 = [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        key: "wmoenq",
      },
    ],
    ["path", { d: "M12 9v4", key: "juzpu7" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }],
  ],
  Cp = We("triangle-alert", O1);
const k1 = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  Ap = We("x", k1);
function U1(a) {
  if (typeof document > "u") return;
  let i = document.head || document.getElementsByTagName("head")[0],
    s = document.createElement("style");
  ((s.type = "text/css"),
    i.appendChild(s),
    s.styleSheet
      ? (s.styleSheet.cssText = a)
      : s.appendChild(document.createTextNode(a)));
}
const L1 = (a) => {
    switch (a) {
      case "success":
        return G1;
      case "info":
        return q1;
      case "warning":
        return Y1;
      case "error":
        return V1;
      default:
        return null;
    }
  },
  B1 = Array(12).fill(0),
  H1 = ({ visible: a, className: i }) =>
    $.createElement(
      "div",
      {
        className: ["sonner-loading-wrapper", i].filter(Boolean).join(" "),
        "data-visible": a,
      },
      $.createElement(
        "div",
        { className: "sonner-spinner" },
        B1.map((s, o) =>
          $.createElement("div", {
            className: "sonner-loading-bar",
            key: `spinner-bar-${o}`,
          }),
        ),
      ),
    ),
  G1 = $.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    $.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clipRule: "evenodd",
    }),
  ),
  Y1 = $.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    $.createElement("path", {
      fillRule: "evenodd",
      d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
      clipRule: "evenodd",
    }),
  ),
  q1 = $.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    $.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
      clipRule: "evenodd",
    }),
  ),
  V1 = $.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    $.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
      clipRule: "evenodd",
    }),
  ),
  X1 = $.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    $.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    $.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
  ),
  Q1 = () => {
    const [a, i] = $.useState(document.hidden);
    return (
      $.useEffect(() => {
        const s = () => {
          i(document.hidden);
        };
        return (
          document.addEventListener("visibilitychange", s),
          () => window.removeEventListener("visibilitychange", s)
        );
      }, []),
      a
    );
  };
let zc = 1;
class Z1 {
  constructor() {
    ((this.subscribe = (i) => (
      this.subscribers.push(i),
      () => {
        const s = this.subscribers.indexOf(i);
        this.subscribers.splice(s, 1);
      }
    )),
      (this.publish = (i) => {
        this.subscribers.forEach((s) => s(i));
      }),
      (this.addToast = (i) => {
        (this.publish(i), (this.toasts = [...this.toasts, i]));
      }),
      (this.create = (i) => {
        var s;
        const { message: o, ...c } = i,
          d =
            typeof i?.id == "number" ||
            ((s = i.id) == null ? void 0 : s.length) > 0
              ? i.id
              : zc++,
          h = this.toasts.find((y) => y.id === d),
          v = i.dismissible === void 0 ? !0 : i.dismissible;
        return (
          this.dismissedToasts.has(d) && this.dismissedToasts.delete(d),
          h
            ? (this.toasts = this.toasts.map((y) =>
                y.id === d
                  ? (this.publish({ ...y, ...i, id: d, title: o }),
                    { ...y, ...i, id: d, dismissible: v, title: o })
                  : y,
              ))
            : this.addToast({ title: o, ...c, dismissible: v, id: d }),
          d
        );
      }),
      (this.dismiss = (i) => (
        i
          ? (this.dismissedToasts.add(i),
            requestAnimationFrame(() =>
              this.subscribers.forEach((s) => s({ id: i, dismiss: !0 })),
            ))
          : this.toasts.forEach((s) => {
              this.subscribers.forEach((o) => o({ id: s.id, dismiss: !0 }));
            }),
        i
      )),
      (this.message = (i, s) => this.create({ ...s, message: i })),
      (this.error = (i, s) => this.create({ ...s, message: i, type: "error" })),
      (this.success = (i, s) =>
        this.create({ ...s, type: "success", message: i })),
      (this.info = (i, s) => this.create({ ...s, type: "info", message: i })),
      (this.warning = (i, s) =>
        this.create({ ...s, type: "warning", message: i })),
      (this.loading = (i, s) =>
        this.create({ ...s, type: "loading", message: i })),
      (this.promise = (i, s) => {
        if (!s) return;
        let o;
        s.loading !== void 0 &&
          (o = this.create({
            ...s,
            promise: i,
            type: "loading",
            message: s.loading,
            description:
              typeof s.description != "function" ? s.description : void 0,
          }));
        const c = Promise.resolve(i instanceof Function ? i() : i);
        let d = o !== void 0,
          h;
        const v = c
            .then(async (g) => {
              if (((h = ["resolve", g]), $.isValidElement(g)))
                ((d = !1), this.create({ id: o, type: "default", message: g }));
              else if (J1(g) && !g.ok) {
                d = !1;
                const p =
                    typeof s.error == "function"
                      ? await s.error(`HTTP error! status: ${g.status}`)
                      : s.error,
                  N =
                    typeof s.description == "function"
                      ? await s.description(`HTTP error! status: ${g.status}`)
                      : s.description,
                  A =
                    typeof p == "object" && !$.isValidElement(p)
                      ? p
                      : { message: p };
                this.create({ id: o, type: "error", description: N, ...A });
              } else if (g instanceof Error) {
                d = !1;
                const p =
                    typeof s.error == "function" ? await s.error(g) : s.error,
                  N =
                    typeof s.description == "function"
                      ? await s.description(g)
                      : s.description,
                  A =
                    typeof p == "object" && !$.isValidElement(p)
                      ? p
                      : { message: p };
                this.create({ id: o, type: "error", description: N, ...A });
              } else if (s.success !== void 0) {
                d = !1;
                const p =
                    typeof s.success == "function"
                      ? await s.success(g)
                      : s.success,
                  N =
                    typeof s.description == "function"
                      ? await s.description(g)
                      : s.description,
                  A =
                    typeof p == "object" && !$.isValidElement(p)
                      ? p
                      : { message: p };
                this.create({ id: o, type: "success", description: N, ...A });
              }
            })
            .catch(async (g) => {
              if (((h = ["reject", g]), s.error !== void 0)) {
                d = !1;
                const S =
                    typeof s.error == "function" ? await s.error(g) : s.error,
                  p =
                    typeof s.description == "function"
                      ? await s.description(g)
                      : s.description,
                  z =
                    typeof S == "object" && !$.isValidElement(S)
                      ? S
                      : { message: S };
                this.create({ id: o, type: "error", description: p, ...z });
              }
            })
            .finally(() => {
              (d && (this.dismiss(o), (o = void 0)),
                s.finally == null || s.finally.call(s));
            }),
          y = () =>
            new Promise((g, S) =>
              v.then(() => (h[0] === "reject" ? S(h[1]) : g(h[1]))).catch(S),
            );
        return typeof o != "string" && typeof o != "number"
          ? { unwrap: y }
          : Object.assign(o, { unwrap: y });
      }),
      (this.custom = (i, s) => {
        const o = s?.id || zc++;
        return (this.create({ jsx: i(o), id: o, ...s }), o);
      }),
      (this.getActiveToasts = () =>
        this.toasts.filter((i) => !this.dismissedToasts.has(i.id))),
      (this.subscribers = []),
      (this.toasts = []),
      (this.dismissedToasts = new Set()));
  }
}
const Ht = new Z1(),
  K1 = (a, i) => {
    const s = i?.id || zc++;
    return (Ht.addToast({ title: a, ...i, id: s }), s);
  },
  J1 = (a) =>
    a &&
    typeof a == "object" &&
    "ok" in a &&
    typeof a.ok == "boolean" &&
    "status" in a &&
    typeof a.status == "number",
  $1 = K1,
  F1 = () => Ht.toasts,
  W1 = () => Ht.getActiveToasts(),
  Fe = Object.assign(
    $1,
    {
      success: Ht.success,
      info: Ht.info,
      warning: Ht.warning,
      error: Ht.error,
      custom: Ht.custom,
      message: Ht.message,
      promise: Ht.promise,
      dismiss: Ht.dismiss,
      loading: Ht.loading,
    },
    { getHistory: F1, getToasts: W1 },
  );
U1(
  "[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}",
);
function Ts(a) {
  return a.label !== void 0;
}
const I1 = 3,
  P1 = "24px",
  eS = "16px",
  Eg = 4e3,
  tS = 356,
  nS = 14,
  aS = 45,
  lS = 200;
function xn(...a) {
  return a.filter(Boolean).join(" ");
}
function iS(a) {
  const [i, s] = a.split("-"),
    o = [];
  return (i && o.push(i), s && o.push(s), o);
}
const rS = (a) => {
  var i, s, o, c, d, h, v, y, g;
  const {
      invert: S,
      toast: p,
      unstyled: N,
      interacting: z,
      setHeights: A,
      visibleToasts: E,
      heights: _,
      index: C,
      toasts: X,
      expanded: L,
      removeToast: F,
      defaultRichColors: H,
      closeButton: J,
      style: B,
      cancelButtonStyle: Y,
      actionButtonStyle: ee,
      className: ye = "",
      descriptionClassName: pe = "",
      duration: Ee,
      position: Le,
      gap: Qe,
      expandByDefault: je,
      classNames: M,
      icons: K,
      closeButtonAriaLabel: ie = "Close toast",
    } = a,
    [ve, W] = $.useState(null),
    [j, q] = $.useState(null),
    [Z, I] = $.useState(!1),
    [P, te] = $.useState(!1),
    [me, de] = $.useState(!1),
    [ue, Gt] = $.useState(!1),
    [Ct, wt] = $.useState(!1),
    [In, bt] = $.useState(0),
    [li, il] = $.useState(0),
    za = $.useRef(p.duration || Ee || Eg),
    ii = $.useRef(null),
    Yt = $.useRef(null),
    ri = C === 0,
    si = C + 1 <= E,
    Nt = p.type,
    Pn = p.dismissible !== !1,
    _t = p.className || "",
    Is = p.descriptionClassName || "",
    Ma = $.useMemo(
      () => _.findIndex((ce) => ce.toastId === p.id) || 0,
      [_, p.id],
    ),
    dr = $.useMemo(() => {
      var ce;
      return (ce = p.closeButton) != null ? ce : J;
    }, [p.closeButton, J]),
    Da = $.useMemo(() => p.duration || Ee || Eg, [p.duration, Ee]),
    oi = $.useRef(0),
    _n = $.useRef(0),
    mr = $.useRef(0),
    ea = $.useRef(null),
    [Oa, jt] = Le.split("-"),
    on = $.useMemo(
      () => _.reduce((ce, Ge, rt) => (rt >= Ma ? ce : ce + Ge.height), 0),
      [_, Ma],
    ),
    yt = Q1(),
    Ps = p.invert || S,
    ui = Nt === "loading";
  ((_n.current = $.useMemo(() => Ma * Qe + on, [Ma, on])),
    $.useEffect(() => {
      za.current = Da;
    }, [Da]),
    $.useEffect(() => {
      I(!0);
    }, []),
    $.useEffect(() => {
      const ce = Yt.current;
      if (ce) {
        const Ge = ce.getBoundingClientRect().height;
        return (
          il(Ge),
          A((rt) => [
            { toastId: p.id, height: Ge, position: p.position },
            ...rt,
          ]),
          () => A((rt) => rt.filter((xt) => xt.toastId !== p.id))
        );
      }
    }, [A, p.id]),
    $.useLayoutEffect(() => {
      if (!Z) return;
      const ce = Yt.current,
        Ge = ce.style.height;
      ce.style.height = "auto";
      const rt = ce.getBoundingClientRect().height;
      ((ce.style.height = Ge),
        il(rt),
        A((xt) =>
          xt.find((Ve) => Ve.toastId === p.id)
            ? xt.map((Ve) => (Ve.toastId === p.id ? { ...Ve, height: rt } : Ve))
            : [{ toastId: p.id, height: rt, position: p.position }, ...xt],
        ));
    }, [Z, p.title, p.description, A, p.id, p.jsx, p.action, p.cancel]));
  const hn = $.useCallback(() => {
    (te(!0),
      bt(_n.current),
      A((ce) => ce.filter((Ge) => Ge.toastId !== p.id)),
      setTimeout(() => {
        F(p);
      }, lS));
  }, [p, F, A, _n]);
  ($.useEffect(() => {
    if (
      (p.promise && Nt === "loading") ||
      p.duration === 1 / 0 ||
      p.type === "loading"
    )
      return;
    let ce;
    return (
      L || z || yt
        ? (() => {
            if (mr.current < oi.current) {
              const xt = new Date().getTime() - oi.current;
              za.current = za.current - xt;
            }
            mr.current = new Date().getTime();
          })()
        : za.current !== 1 / 0 &&
          ((oi.current = new Date().getTime()),
          (ce = setTimeout(() => {
            (p.onAutoClose == null || p.onAutoClose.call(p, p), hn());
          }, za.current))),
      () => clearTimeout(ce)
    );
  }, [L, z, p, Nt, yt, hn]),
    $.useEffect(() => {
      p.delete && (hn(), p.onDismiss == null || p.onDismiss.call(p, p));
    }, [hn, p.delete]));
  function rl() {
    var ce;
    if (K?.loading) {
      var Ge;
      return $.createElement(
        "div",
        {
          className: xn(
            M?.loader,
            p == null || (Ge = p.classNames) == null ? void 0 : Ge.loader,
            "sonner-loader",
          ),
          "data-visible": Nt === "loading",
        },
        K.loading,
      );
    }
    return $.createElement(H1, {
      className: xn(
        M?.loader,
        p == null || (ce = p.classNames) == null ? void 0 : ce.loader,
      ),
      visible: Nt === "loading",
    });
  }
  const sl = p.icon || K?.[Nt] || L1(Nt);
  var ka, gn;
  return $.createElement(
    "li",
    {
      tabIndex: 0,
      ref: Yt,
      className: xn(
        ye,
        _t,
        M?.toast,
        p == null || (i = p.classNames) == null ? void 0 : i.toast,
        M?.default,
        M?.[Nt],
        p == null || (s = p.classNames) == null ? void 0 : s[Nt],
      ),
      "data-sonner-toast": "",
      "data-rich-colors": (ka = p.richColors) != null ? ka : H,
      "data-styled": !(p.jsx || p.unstyled || N),
      "data-mounted": Z,
      "data-promise": !!p.promise,
      "data-swiped": Ct,
      "data-removed": P,
      "data-visible": si,
      "data-y-position": Oa,
      "data-x-position": jt,
      "data-index": C,
      "data-front": ri,
      "data-swiping": me,
      "data-dismissible": Pn,
      "data-type": Nt,
      "data-invert": Ps,
      "data-swipe-out": ue,
      "data-swipe-direction": j,
      "data-expanded": !!(L || (je && Z)),
      "data-testid": p.testId,
      style: {
        "--index": C,
        "--toasts-before": C,
        "--z-index": X.length - C,
        "--offset": `${P ? In : _n.current}px`,
        "--initial-height": je ? "auto" : `${li}px`,
        ...B,
        ...p.style,
      },
      onDragEnd: () => {
        (de(!1), W(null), (ea.current = null));
      },
      onPointerDown: (ce) => {
        ce.button !== 2 &&
          (ui ||
            !Pn ||
            ((ii.current = new Date()),
            bt(_n.current),
            ce.target.setPointerCapture(ce.pointerId),
            ce.target.tagName !== "BUTTON" &&
              (de(!0), (ea.current = { x: ce.clientX, y: ce.clientY }))));
      },
      onPointerUp: () => {
        var ce, Ge, rt;
        if (ue || !Pn) return;
        ea.current = null;
        const xt = Number(
            ((ce = Yt.current) == null
              ? void 0
              : ce.style
                  .getPropertyValue("--swipe-amount-x")
                  .replace("px", "")) || 0,
          ),
          ta = Number(
            ((Ge = Yt.current) == null
              ? void 0
              : Ge.style
                  .getPropertyValue("--swipe-amount-y")
                  .replace("px", "")) || 0,
          ),
          Ve =
            new Date().getTime() -
            ((rt = ii.current) == null ? void 0 : rt.getTime()),
          At = ve === "x" ? xt : ta,
          Ua = Math.abs(At) / Ve;
        if (Math.abs(At) >= aS || Ua > 0.11) {
          (bt(_n.current),
            p.onDismiss == null || p.onDismiss.call(p, p),
            q(
              ve === "x" ? (xt > 0 ? "right" : "left") : ta > 0 ? "down" : "up",
            ),
            hn(),
            Gt(!0));
          return;
        } else {
          var Rt, zt;
          ((Rt = Yt.current) == null ||
            Rt.style.setProperty("--swipe-amount-x", "0px"),
            (zt = Yt.current) == null ||
              zt.style.setProperty("--swipe-amount-y", "0px"));
        }
        (wt(!1), de(!1), W(null));
      },
      onPointerMove: (ce) => {
        var Ge, rt, xt;
        if (
          !ea.current ||
          !Pn ||
          ((Ge = window.getSelection()) == null
            ? void 0
            : Ge.toString().length) > 0
        )
          return;
        const Ve = ce.clientY - ea.current.y,
          At = ce.clientX - ea.current.x;
        var Ua;
        const Rt = (Ua = a.swipeDirections) != null ? Ua : iS(Le);
        !ve &&
          (Math.abs(At) > 1 || Math.abs(Ve) > 1) &&
          W(Math.abs(At) > Math.abs(Ve) ? "x" : "y");
        let zt = { x: 0, y: 0 };
        const ol = (un) => 1 / (1.5 + Math.abs(un) / 20);
        if (ve === "y") {
          if (Rt.includes("top") || Rt.includes("bottom"))
            if (
              (Rt.includes("top") && Ve < 0) ||
              (Rt.includes("bottom") && Ve > 0)
            )
              zt.y = Ve;
            else {
              const un = Ve * ol(Ve);
              zt.y = Math.abs(un) < Math.abs(Ve) ? un : Ve;
            }
        } else if (ve === "x" && (Rt.includes("left") || Rt.includes("right")))
          if (
            (Rt.includes("left") && At < 0) ||
            (Rt.includes("right") && At > 0)
          )
            zt.x = At;
          else {
            const un = At * ol(At);
            zt.x = Math.abs(un) < Math.abs(At) ? un : At;
          }
        ((Math.abs(zt.x) > 0 || Math.abs(zt.y) > 0) && wt(!0),
          (rt = Yt.current) == null ||
            rt.style.setProperty("--swipe-amount-x", `${zt.x}px`),
          (xt = Yt.current) == null ||
            xt.style.setProperty("--swipe-amount-y", `${zt.y}px`));
      },
    },
    dr && !p.jsx && Nt !== "loading"
      ? $.createElement(
          "button",
          {
            "aria-label": ie,
            "data-disabled": ui,
            "data-close-button": !0,
            onClick:
              ui || !Pn
                ? () => {}
                : () => {
                    (hn(), p.onDismiss == null || p.onDismiss.call(p, p));
                  },
            className: xn(
              M?.closeButton,
              p == null || (o = p.classNames) == null ? void 0 : o.closeButton,
            ),
          },
          (gn = K?.close) != null ? gn : X1,
        )
      : null,
    (Nt || p.icon || p.promise) &&
      p.icon !== null &&
      (K?.[Nt] !== null || p.icon)
      ? $.createElement(
          "div",
          {
            "data-icon": "",
            className: xn(
              M?.icon,
              p == null || (c = p.classNames) == null ? void 0 : c.icon,
            ),
          },
          p.promise || (p.type === "loading" && !p.icon)
            ? p.icon || rl()
            : null,
          p.type !== "loading" ? sl : null,
        )
      : null,
    $.createElement(
      "div",
      {
        "data-content": "",
        className: xn(
          M?.content,
          p == null || (d = p.classNames) == null ? void 0 : d.content,
        ),
      },
      $.createElement(
        "div",
        {
          "data-title": "",
          className: xn(
            M?.title,
            p == null || (h = p.classNames) == null ? void 0 : h.title,
          ),
        },
        p.jsx ? p.jsx : typeof p.title == "function" ? p.title() : p.title,
      ),
      p.description
        ? $.createElement(
            "div",
            {
              "data-description": "",
              className: xn(
                pe,
                Is,
                M?.description,
                p == null || (v = p.classNames) == null
                  ? void 0
                  : v.description,
              ),
            },
            typeof p.description == "function"
              ? p.description()
              : p.description,
          )
        : null,
    ),
    $.isValidElement(p.cancel)
      ? p.cancel
      : p.cancel && Ts(p.cancel)
        ? $.createElement(
            "button",
            {
              "data-button": !0,
              "data-cancel": !0,
              style: p.cancelButtonStyle || Y,
              onClick: (ce) => {
                Ts(p.cancel) &&
                  Pn &&
                  (p.cancel.onClick == null ||
                    p.cancel.onClick.call(p.cancel, ce),
                  hn());
              },
              className: xn(
                M?.cancelButton,
                p == null || (y = p.classNames) == null
                  ? void 0
                  : y.cancelButton,
              ),
            },
            p.cancel.label,
          )
        : null,
    $.isValidElement(p.action)
      ? p.action
      : p.action && Ts(p.action)
        ? $.createElement(
            "button",
            {
              "data-button": !0,
              "data-action": !0,
              style: p.actionButtonStyle || ee,
              onClick: (ce) => {
                Ts(p.action) &&
                  (p.action.onClick == null ||
                    p.action.onClick.call(p.action, ce),
                  !ce.defaultPrevented && hn());
              },
              className: xn(
                M?.actionButton,
                p == null || (g = p.classNames) == null
                  ? void 0
                  : g.actionButton,
              ),
            },
            p.action.label,
          )
        : null,
  );
};
function wg() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  const a = document.documentElement.getAttribute("dir");
  return a === "auto" || !a
    ? window.getComputedStyle(document.documentElement).direction
    : a;
}
function sS(a, i) {
  const s = {};
  return (
    [a, i].forEach((o, c) => {
      const d = c === 1,
        h = d ? "--mobile-offset" : "--offset",
        v = d ? eS : P1;
      function y(g) {
        ["top", "right", "bottom", "left"].forEach((S) => {
          s[`${h}-${S}`] = typeof g == "number" ? `${g}px` : g;
        });
      }
      typeof o == "number" || typeof o == "string"
        ? y(o)
        : typeof o == "object"
          ? ["top", "right", "bottom", "left"].forEach((g) => {
              o[g] === void 0
                ? (s[`${h}-${g}`] = v)
                : (s[`${h}-${g}`] =
                    typeof o[g] == "number" ? `${o[g]}px` : o[g]);
            })
          : y(v);
    }),
    s
  );
}
const oS = $.forwardRef(function (i, s) {
  const {
      id: o,
      invert: c,
      position: d = "bottom-right",
      hotkey: h = ["altKey", "KeyT"],
      expand: v,
      closeButton: y,
      className: g,
      offset: S,
      mobileOffset: p,
      theme: N = "light",
      richColors: z,
      duration: A,
      style: E,
      visibleToasts: _ = I1,
      toastOptions: C,
      dir: X = wg(),
      gap: L = nS,
      icons: F,
      containerAriaLabel: H = "Notifications",
    } = i,
    [J, B] = $.useState([]),
    Y = $.useMemo(
      () =>
        o ? J.filter((Z) => Z.toasterId === o) : J.filter((Z) => !Z.toasterId),
      [J, o],
    ),
    ee = $.useMemo(
      () =>
        Array.from(
          new Set(
            [d].concat(Y.filter((Z) => Z.position).map((Z) => Z.position)),
          ),
        ),
      [Y, d],
    ),
    [ye, pe] = $.useState([]),
    [Ee, Le] = $.useState(!1),
    [Qe, je] = $.useState(!1),
    [M, K] = $.useState(
      N !== "system"
        ? N
        : typeof window < "u" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
    ),
    ie = $.useRef(null),
    ve = h.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
    W = $.useRef(null),
    j = $.useRef(!1),
    q = $.useCallback((Z) => {
      B((I) => {
        var P;
        return (
          ((P = I.find((te) => te.id === Z.id)) != null && P.delete) ||
            Ht.dismiss(Z.id),
          I.filter(({ id: te }) => te !== Z.id)
        );
      });
    }, []);
  return (
    $.useEffect(
      () =>
        Ht.subscribe((Z) => {
          if (Z.dismiss) {
            requestAnimationFrame(() => {
              B((I) =>
                I.map((P) => (P.id === Z.id ? { ...P, delete: !0 } : P)),
              );
            });
            return;
          }
          setTimeout(() => {
            Sp.flushSync(() => {
              B((I) => {
                const P = I.findIndex((te) => te.id === Z.id);
                return P !== -1
                  ? [...I.slice(0, P), { ...I[P], ...Z }, ...I.slice(P + 1)]
                  : [Z, ...I];
              });
            });
          });
        }),
      [J],
    ),
    $.useEffect(() => {
      if (N !== "system") {
        K(N);
        return;
      }
      if (
        (N === "system" &&
          (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? K("dark")
            : K("light")),
        typeof window > "u")
      )
        return;
      const Z = window.matchMedia("(prefers-color-scheme: dark)");
      try {
        Z.addEventListener("change", ({ matches: I }) => {
          K(I ? "dark" : "light");
        });
      } catch {
        Z.addListener(({ matches: P }) => {
          try {
            K(P ? "dark" : "light");
          } catch (te) {
            console.error(te);
          }
        });
      }
    }, [N]),
    $.useEffect(() => {
      J.length <= 1 && Le(!1);
    }, [J]),
    $.useEffect(() => {
      const Z = (I) => {
        var P;
        if (h.every((de) => I[de] || I.code === de)) {
          var me;
          (Le(!0), (me = ie.current) == null || me.focus());
        }
        I.code === "Escape" &&
          (document.activeElement === ie.current ||
            ((P = ie.current) != null && P.contains(document.activeElement))) &&
          Le(!1);
      };
      return (
        document.addEventListener("keydown", Z),
        () => document.removeEventListener("keydown", Z)
      );
    }, [h]),
    $.useEffect(() => {
      if (ie.current)
        return () => {
          W.current &&
            (W.current.focus({ preventScroll: !0 }),
            (W.current = null),
            (j.current = !1));
        };
    }, [ie.current]),
    $.createElement(
      "section",
      {
        ref: s,
        "aria-label": `${H} ${ve}`,
        tabIndex: -1,
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-atomic": "false",
        suppressHydrationWarning: !0,
      },
      ee.map((Z, I) => {
        var P;
        const [te, me] = Z.split("-");
        return Y.length
          ? $.createElement(
              "ol",
              {
                key: Z,
                dir: X === "auto" ? wg() : X,
                tabIndex: -1,
                ref: ie,
                className: g,
                "data-sonner-toaster": !0,
                "data-sonner-theme": M,
                "data-y-position": te,
                "data-x-position": me,
                style: {
                  "--front-toast-height": `${((P = ye[0]) == null ? void 0 : P.height) || 0}px`,
                  "--width": `${tS}px`,
                  "--gap": `${L}px`,
                  ...E,
                  ...sS(S, p),
                },
                onBlur: (de) => {
                  j.current &&
                    !de.currentTarget.contains(de.relatedTarget) &&
                    ((j.current = !1),
                    W.current &&
                      (W.current.focus({ preventScroll: !0 }),
                      (W.current = null)));
                },
                onFocus: (de) => {
                  (de.target instanceof HTMLElement &&
                    de.target.dataset.dismissible === "false") ||
                    j.current ||
                    ((j.current = !0), (W.current = de.relatedTarget));
                },
                onMouseEnter: () => Le(!0),
                onMouseMove: () => Le(!0),
                onMouseLeave: () => {
                  Qe || Le(!1);
                },
                onDragEnd: () => Le(!1),
                onPointerDown: (de) => {
                  (de.target instanceof HTMLElement &&
                    de.target.dataset.dismissible === "false") ||
                    je(!0);
                },
                onPointerUp: () => je(!1),
              },
              Y.filter(
                (de) => (!de.position && I === 0) || de.position === Z,
              ).map((de, ue) => {
                var Gt, Ct;
                return $.createElement(rS, {
                  key: de.id,
                  icons: F,
                  index: ue,
                  toast: de,
                  defaultRichColors: z,
                  duration: (Gt = C?.duration) != null ? Gt : A,
                  className: C?.className,
                  descriptionClassName: C?.descriptionClassName,
                  invert: c,
                  visibleToasts: _,
                  closeButton: (Ct = C?.closeButton) != null ? Ct : y,
                  interacting: Qe,
                  position: Z,
                  style: C?.style,
                  unstyled: C?.unstyled,
                  classNames: C?.classNames,
                  cancelButtonStyle: C?.cancelButtonStyle,
                  actionButtonStyle: C?.actionButtonStyle,
                  closeButtonAriaLabel: C?.closeButtonAriaLabel,
                  removeToast: q,
                  toasts: Y.filter((wt) => wt.position == de.position),
                  heights: ye.filter((wt) => wt.position == de.position),
                  setHeights: pe,
                  expandByDefault: v,
                  gap: L,
                  expanded: Ee,
                  swipeDirections: i.swipeDirections,
                });
              }),
            )
          : null;
      }),
    )
  );
});
function uS({ ...a }) {
  return f.jsx(oS, {
    className: "toaster group",
    icons: {
      success: f.jsx(jp, { className: "size-4" }),
      info: f.jsx(b1, { className: "size-4" }),
      warning: f.jsx(Cp, { className: "size-4" }),
      error: f.jsx(T1, { className: "size-4" }),
      loading: f.jsx(gt, { className: "size-4 animate-spin" }),
    },
    style: {
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
      "--border-radius": "var(--radius)",
    },
    ...a,
  });
}
function Rp(a) {
  var i,
    s,
    o = "";
  if (typeof a == "string" || typeof a == "number") o += a;
  else if (typeof a == "object")
    if (Array.isArray(a)) {
      var c = a.length;
      for (i = 0; i < c; i++)
        a[i] && (s = Rp(a[i])) && (o && (o += " "), (o += s));
    } else for (s in a) a[s] && (o && (o += " "), (o += s));
  return o;
}
function zp() {
  for (var a, i, s = 0, o = "", c = arguments.length; s < c; s++)
    (a = arguments[s]) && (i = Rp(a)) && (o && (o += " "), (o += i));
  return o;
}
const Ng = (a) => (typeof a == "boolean" ? `${a}` : a === 0 ? "0" : a),
  _g = zp,
  Zc = (a, i) => (s) => {
    var o;
    if (i?.variants == null) return _g(a, s?.class, s?.className);
    const { variants: c, defaultVariants: d } = i,
      h = Object.keys(c).map((g) => {
        const S = s?.[g],
          p = d?.[g];
        if (S === null) return null;
        const N = Ng(S) || Ng(p);
        return c[g][N];
      }),
      v =
        s &&
        Object.entries(s).reduce((g, S) => {
          let [p, N] = S;
          return (N === void 0 || (g[p] = N), g);
        }, {}),
      y =
        i == null || (o = i.compoundVariants) === null || o === void 0
          ? void 0
          : o.reduce((g, S) => {
              let { class: p, className: N, ...z } = S;
              return Object.entries(z).every((A) => {
                let [E, _] = A;
                return Array.isArray(_)
                  ? _.includes({ ...d, ...v }[E])
                  : { ...d, ...v }[E] === _;
              })
                ? [...g, p, N]
                : g;
            }, []);
    return _g(a, h, y, s?.class, s?.className);
  };
function jg(a, i) {
  if (typeof a == "function") return a(i);
  a != null && (a.current = i);
}
function Mp(...a) {
  return (i) => {
    let s = !1;
    const o = a.map((c) => {
      const d = jg(c, i);
      return (!s && typeof d == "function" && (s = !0), d);
    });
    if (s)
      return () => {
        for (let c = 0; c < o.length; c++) {
          const d = o[c];
          typeof d == "function" ? d() : jg(a[c], null);
        }
      };
  };
}
function Nn(...a) {
  return b.useCallback(Mp(...a), a);
}
function ir(a) {
  const i = cS(a),
    s = b.forwardRef((o, c) => {
      const { children: d, ...h } = o,
        v = b.Children.toArray(d),
        y = v.find(dS);
      if (y) {
        const g = y.props.children,
          S = v.map((p) =>
            p === y
              ? b.Children.count(g) > 1
                ? b.Children.only(null)
                : b.isValidElement(g)
                  ? g.props.children
                  : null
              : p,
          );
        return f.jsx(i, {
          ...h,
          ref: c,
          children: b.isValidElement(g) ? b.cloneElement(g, void 0, S) : null,
        });
      }
      return f.jsx(i, { ...h, ref: c, children: d });
    });
  return ((s.displayName = `${a}.Slot`), s);
}
var Dp = ir("Slot");
function cS(a) {
  const i = b.forwardRef((s, o) => {
    const { children: c, ...d } = s;
    if (b.isValidElement(c)) {
      const h = hS(c),
        v = mS(d, c.props);
      return (
        c.type !== b.Fragment && (v.ref = o ? Mp(o, h) : h),
        b.cloneElement(c, v)
      );
    }
    return b.Children.count(c) > 1 ? b.Children.only(null) : null;
  });
  return ((i.displayName = `${a}.SlotClone`), i);
}
var fS = Symbol("radix.slottable");
function dS(a) {
  return (
    b.isValidElement(a) &&
    typeof a.type == "function" &&
    "__radixId" in a.type &&
    a.type.__radixId === fS
  );
}
function mS(a, i) {
  const s = { ...i };
  for (const o in i) {
    const c = a[o],
      d = i[o];
    /^on[A-Z]/.test(o)
      ? c && d
        ? (s[o] = (...v) => {
            const y = d(...v);
            return (c(...v), y);
          })
        : c && (s[o] = c)
      : o === "style"
        ? (s[o] = { ...c, ...d })
        : o === "className" && (s[o] = [c, d].filter(Boolean).join(" "));
  }
  return { ...a, ...s };
}
function hS(a) {
  let i = Object.getOwnPropertyDescriptor(a.props, "ref")?.get,
    s = i && "isReactWarning" in i && i.isReactWarning;
  return s
    ? a.ref
    : ((i = Object.getOwnPropertyDescriptor(a, "ref")?.get),
      (s = i && "isReactWarning" in i && i.isReactWarning),
      s ? a.props.ref : a.props.ref || a.ref);
}
var gS = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  Et = gS.reduce((a, i) => {
    const s = ir(`Primitive.${i}`),
      o = b.forwardRef((c, d) => {
        const { asChild: h, ...v } = c,
          y = h ? s : i;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          f.jsx(y, { ...v, ref: d })
        );
      });
    return ((o.displayName = `Primitive.${i}`), { ...a, [i]: o });
  }, {});
function pS(a, i) {
  a && xp.flushSync(() => a.dispatchEvent(i));
}
function vS(a, i) {
  const s = b.createContext(i),
    o = (d) => {
      const { children: h, ...v } = d,
        y = b.useMemo(() => v, Object.values(v));
      return f.jsx(s.Provider, { value: y, children: h });
    };
  o.displayName = a + "Provider";
  function c(d) {
    const h = b.useContext(s);
    if (h) return h;
    if (i !== void 0) return i;
    throw new Error(`\`${d}\` must be used within \`${a}\``);
  }
  return [o, c];
}
function Js(a, i = []) {
  let s = [];
  function o(d, h) {
    const v = b.createContext(h),
      y = s.length;
    s = [...s, h];
    const g = (p) => {
      const { scope: N, children: z, ...A } = p,
        E = N?.[a]?.[y] || v,
        _ = b.useMemo(() => A, Object.values(A));
      return f.jsx(E.Provider, { value: _, children: z });
    };
    g.displayName = d + "Provider";
    function S(p, N) {
      const z = N?.[a]?.[y] || v,
        A = b.useContext(z);
      if (A) return A;
      if (h !== void 0) return h;
      throw new Error(`\`${p}\` must be used within \`${d}\``);
    }
    return [g, S];
  }
  const c = () => {
    const d = s.map((h) => b.createContext(h));
    return function (v) {
      const y = v?.[a] || d;
      return b.useMemo(() => ({ [`__scope${a}`]: { ...v, [a]: y } }), [v, y]);
    };
  };
  return ((c.scopeName = a), [o, bS(c, ...i)]);
}
function bS(...a) {
  const i = a[0];
  if (a.length === 1) return i;
  const s = () => {
    const o = a.map((c) => ({ useScope: c(), scopeName: c.scopeName }));
    return function (d) {
      const h = o.reduce((v, { useScope: y, scopeName: g }) => {
        const p = y(d)[`__scope${g}`];
        return { ...v, ...p };
      }, {});
      return b.useMemo(() => ({ [`__scope${i.scopeName}`]: h }), [h]);
    };
  };
  return ((s.scopeName = i.scopeName), s);
}
function yS(a) {
  const i = a + "CollectionProvider",
    [s, o] = Js(i),
    [c, d] = s(i, { collectionRef: { current: null }, itemMap: new Map() }),
    h = (E) => {
      const { scope: _, children: C } = E,
        X = $.useRef(null),
        L = $.useRef(new Map()).current;
      return f.jsx(c, { scope: _, itemMap: L, collectionRef: X, children: C });
    };
  h.displayName = i;
  const v = a + "CollectionSlot",
    y = ir(v),
    g = $.forwardRef((E, _) => {
      const { scope: C, children: X } = E,
        L = d(v, C),
        F = Nn(_, L.collectionRef);
      return f.jsx(y, { ref: F, children: X });
    });
  g.displayName = v;
  const S = a + "CollectionItemSlot",
    p = "data-radix-collection-item",
    N = ir(S),
    z = $.forwardRef((E, _) => {
      const { scope: C, children: X, ...L } = E,
        F = $.useRef(null),
        H = Nn(_, F),
        J = d(S, C);
      return (
        $.useEffect(
          () => (
            J.itemMap.set(F, { ref: F, ...L }),
            () => {
              J.itemMap.delete(F);
            }
          ),
        ),
        f.jsx(N, { [p]: "", ref: H, children: X })
      );
    });
  z.displayName = S;
  function A(E) {
    const _ = d(a + "CollectionConsumer", E);
    return $.useCallback(() => {
      const X = _.collectionRef.current;
      if (!X) return [];
      const L = Array.from(X.querySelectorAll(`[${p}]`));
      return Array.from(_.itemMap.values()).sort(
        (J, B) => L.indexOf(J.ref.current) - L.indexOf(B.ref.current),
      );
    }, [_.collectionRef, _.itemMap]);
  }
  return [{ Provider: h, Slot: g, ItemSlot: z }, A, o];
}
function pt(a, i, { checkForDefaultPrevented: s = !0 } = {}) {
  return function (c) {
    if ((a?.(c), s === !1 || !c.defaultPrevented)) return i?.(c);
  };
}
var rr = globalThis?.document ? b.useLayoutEffect : () => {},
  xS = ep[" useInsertionEffect ".trim().toString()] || rr;
function Kc({ prop: a, defaultProp: i, onChange: s = () => {}, caller: o }) {
  const [c, d, h] = SS({ defaultProp: i, onChange: s }),
    v = a !== void 0,
    y = v ? a : c;
  {
    const S = b.useRef(a !== void 0);
    b.useEffect(() => {
      const p = S.current;
      (p !== v &&
        console.warn(
          `${o} is changing from ${p ? "controlled" : "uncontrolled"} to ${v ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (S.current = v));
    }, [v, o]);
  }
  const g = b.useCallback(
    (S) => {
      if (v) {
        const p = ES(S) ? S(a) : S;
        p !== a && h.current?.(p);
      } else d(S);
    },
    [v, a, d, h],
  );
  return [y, g];
}
function SS({ defaultProp: a, onChange: i }) {
  const [s, o] = b.useState(a),
    c = b.useRef(s),
    d = b.useRef(i);
  return (
    xS(() => {
      d.current = i;
    }, [i]),
    b.useEffect(() => {
      c.current !== s && (d.current?.(s), (c.current = s));
    }, [s, c]),
    [s, o, d]
  );
}
function ES(a) {
  return typeof a == "function";
}
function wS(a, i) {
  return b.useReducer((s, o) => i[s][o] ?? s, a);
}
var cr = (a) => {
  const { present: i, children: s } = a,
    o = NS(i),
    c =
      typeof s == "function" ? s({ present: o.isPresent }) : b.Children.only(s),
    d = Nn(o.ref, _S(c));
  return typeof s == "function" || o.isPresent
    ? b.cloneElement(c, { ref: d })
    : null;
};
cr.displayName = "Presence";
function NS(a) {
  const [i, s] = b.useState(),
    o = b.useRef(null),
    c = b.useRef(a),
    d = b.useRef("none"),
    h = a ? "mounted" : "unmounted",
    [v, y] = wS(h, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    b.useEffect(() => {
      const g = Cs(o.current);
      d.current = v === "mounted" ? g : "none";
    }, [v]),
    rr(() => {
      const g = o.current,
        S = c.current;
      if (S !== a) {
        const N = d.current,
          z = Cs(g);
        (a
          ? y("MOUNT")
          : z === "none" || g?.display === "none"
            ? y("UNMOUNT")
            : y(S && N !== z ? "ANIMATION_OUT" : "UNMOUNT"),
          (c.current = a));
      }
    }, [a, y]),
    rr(() => {
      if (i) {
        let g;
        const S = i.ownerDocument.defaultView ?? window,
          p = (z) => {
            const E = Cs(o.current).includes(CSS.escape(z.animationName));
            if (z.target === i && E && (y("ANIMATION_END"), !c.current)) {
              const _ = i.style.animationFillMode;
              ((i.style.animationFillMode = "forwards"),
                (g = S.setTimeout(() => {
                  i.style.animationFillMode === "forwards" &&
                    (i.style.animationFillMode = _);
                })));
            }
          },
          N = (z) => {
            z.target === i && (d.current = Cs(o.current));
          };
        return (
          i.addEventListener("animationstart", N),
          i.addEventListener("animationcancel", p),
          i.addEventListener("animationend", p),
          () => {
            (S.clearTimeout(g),
              i.removeEventListener("animationstart", N),
              i.removeEventListener("animationcancel", p),
              i.removeEventListener("animationend", p));
          }
        );
      } else y("ANIMATION_END");
    }, [i, y]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(v),
      ref: b.useCallback((g) => {
        ((o.current = g ? getComputedStyle(g) : null), s(g));
      }, []),
    }
  );
}
function Cs(a) {
  return a?.animationName || "none";
}
function _S(a) {
  let i = Object.getOwnPropertyDescriptor(a.props, "ref")?.get,
    s = i && "isReactWarning" in i && i.isReactWarning;
  return s
    ? a.ref
    : ((i = Object.getOwnPropertyDescriptor(a, "ref")?.get),
      (s = i && "isReactWarning" in i && i.isReactWarning),
      s ? a.props.ref : a.props.ref || a.ref);
}
var jS = ep[" useId ".trim().toString()] || (() => {}),
  TS = 0;
function ar(a) {
  const [i, s] = b.useState(jS());
  return (
    rr(() => {
      s((o) => o ?? String(TS++));
    }, [a]),
    a || (i ? `radix-${i}` : "")
  );
}
var CS = b.createContext(void 0);
function Op(a) {
  const i = b.useContext(CS);
  return a || i || "ltr";
}
function ti(a) {
  const i = b.useRef(a);
  return (
    b.useEffect(() => {
      i.current = a;
    }),
    b.useMemo(
      () =>
        (...s) =>
          i.current?.(...s),
      [],
    )
  );
}
function AS(a, i = globalThis?.document) {
  const s = ti(a);
  b.useEffect(() => {
    const o = (c) => {
      c.key === "Escape" && s(c);
    };
    return (
      i.addEventListener("keydown", o, { capture: !0 }),
      () => i.removeEventListener("keydown", o, { capture: !0 })
    );
  }, [s, i]);
}
var RS = "DismissableLayer",
  Mc = "dismissableLayer.update",
  zS = "dismissableLayer.pointerDownOutside",
  MS = "dismissableLayer.focusOutside",
  Tg,
  kp = b.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  Up = b.forwardRef((a, i) => {
    const {
        disableOutsidePointerEvents: s = !1,
        onEscapeKeyDown: o,
        onPointerDownOutside: c,
        onFocusOutside: d,
        onInteractOutside: h,
        onDismiss: v,
        ...y
      } = a,
      g = b.useContext(kp),
      [S, p] = b.useState(null),
      N = S?.ownerDocument ?? globalThis?.document,
      [, z] = b.useState({}),
      A = Nn(i, (B) => p(B)),
      E = Array.from(g.layers),
      [_] = [...g.layersWithOutsidePointerEventsDisabled].slice(-1),
      C = E.indexOf(_),
      X = S ? E.indexOf(S) : -1,
      L = g.layersWithOutsidePointerEventsDisabled.size > 0,
      F = X >= C,
      H = kS((B) => {
        const Y = B.target,
          ee = [...g.branches].some((ye) => ye.contains(Y));
        !F || ee || (c?.(B), h?.(B), B.defaultPrevented || v?.());
      }, N),
      J = US((B) => {
        const Y = B.target;
        [...g.branches].some((ye) => ye.contains(Y)) ||
          (d?.(B), h?.(B), B.defaultPrevented || v?.());
      }, N);
    return (
      AS((B) => {
        X === g.layers.size - 1 &&
          (o?.(B), !B.defaultPrevented && v && (B.preventDefault(), v()));
      }, N),
      b.useEffect(() => {
        if (S)
          return (
            s &&
              (g.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Tg = N.body.style.pointerEvents),
                (N.body.style.pointerEvents = "none")),
              g.layersWithOutsidePointerEventsDisabled.add(S)),
            g.layers.add(S),
            Cg(),
            () => {
              s &&
                g.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (N.body.style.pointerEvents = Tg);
            }
          );
      }, [S, N, s, g]),
      b.useEffect(
        () => () => {
          S &&
            (g.layers.delete(S),
            g.layersWithOutsidePointerEventsDisabled.delete(S),
            Cg());
        },
        [S, g],
      ),
      b.useEffect(() => {
        const B = () => z({});
        return (
          document.addEventListener(Mc, B),
          () => document.removeEventListener(Mc, B)
        );
      }, []),
      f.jsx(Et.div, {
        ...y,
        ref: A,
        style: {
          pointerEvents: L ? (F ? "auto" : "none") : void 0,
          ...a.style,
        },
        onFocusCapture: pt(a.onFocusCapture, J.onFocusCapture),
        onBlurCapture: pt(a.onBlurCapture, J.onBlurCapture),
        onPointerDownCapture: pt(
          a.onPointerDownCapture,
          H.onPointerDownCapture,
        ),
      })
    );
  });
Up.displayName = RS;
var DS = "DismissableLayerBranch",
  OS = b.forwardRef((a, i) => {
    const s = b.useContext(kp),
      o = b.useRef(null),
      c = Nn(i, o);
    return (
      b.useEffect(() => {
        const d = o.current;
        if (d)
          return (
            s.branches.add(d),
            () => {
              s.branches.delete(d);
            }
          );
      }, [s.branches]),
      f.jsx(Et.div, { ...a, ref: c })
    );
  });
OS.displayName = DS;
function kS(a, i = globalThis?.document) {
  const s = ti(a),
    o = b.useRef(!1),
    c = b.useRef(() => {});
  return (
    b.useEffect(() => {
      const d = (v) => {
          if (v.target && !o.current) {
            let y = function () {
              Lp(zS, s, g, { discrete: !0 });
            };
            const g = { originalEvent: v };
            v.pointerType === "touch"
              ? (i.removeEventListener("click", c.current),
                (c.current = y),
                i.addEventListener("click", c.current, { once: !0 }))
              : y();
          } else i.removeEventListener("click", c.current);
          o.current = !1;
        },
        h = window.setTimeout(() => {
          i.addEventListener("pointerdown", d);
        }, 0);
      return () => {
        (window.clearTimeout(h),
          i.removeEventListener("pointerdown", d),
          i.removeEventListener("click", c.current));
      };
    }, [i, s]),
    { onPointerDownCapture: () => (o.current = !0) }
  );
}
function US(a, i = globalThis?.document) {
  const s = ti(a),
    o = b.useRef(!1);
  return (
    b.useEffect(() => {
      const c = (d) => {
        d.target &&
          !o.current &&
          Lp(MS, s, { originalEvent: d }, { discrete: !1 });
      };
      return (
        i.addEventListener("focusin", c),
        () => i.removeEventListener("focusin", c)
      );
    }, [i, s]),
    {
      onFocusCapture: () => (o.current = !0),
      onBlurCapture: () => (o.current = !1),
    }
  );
}
function Cg() {
  const a = new CustomEvent(Mc);
  document.dispatchEvent(a);
}
function Lp(a, i, s, { discrete: o }) {
  const c = s.originalEvent.target,
    d = new CustomEvent(a, { bubbles: !1, cancelable: !0, detail: s });
  (i && c.addEventListener(a, i, { once: !0 }),
    o ? pS(c, d) : c.dispatchEvent(d));
}
var xc = "focusScope.autoFocusOnMount",
  Sc = "focusScope.autoFocusOnUnmount",
  Ag = { bubbles: !1, cancelable: !0 },
  LS = "FocusScope",
  Bp = b.forwardRef((a, i) => {
    const {
        loop: s = !1,
        trapped: o = !1,
        onMountAutoFocus: c,
        onUnmountAutoFocus: d,
        ...h
      } = a,
      [v, y] = b.useState(null),
      g = ti(c),
      S = ti(d),
      p = b.useRef(null),
      N = Nn(i, (E) => y(E)),
      z = b.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    (b.useEffect(() => {
      if (o) {
        let E = function (L) {
            if (z.paused || !v) return;
            const F = L.target;
            v.contains(F) ? (p.current = F) : Ca(p.current, { select: !0 });
          },
          _ = function (L) {
            if (z.paused || !v) return;
            const F = L.relatedTarget;
            F !== null && (v.contains(F) || Ca(p.current, { select: !0 }));
          },
          C = function (L) {
            if (document.activeElement === document.body)
              for (const H of L) H.removedNodes.length > 0 && Ca(v);
          };
        (document.addEventListener("focusin", E),
          document.addEventListener("focusout", _));
        const X = new MutationObserver(C);
        return (
          v && X.observe(v, { childList: !0, subtree: !0 }),
          () => {
            (document.removeEventListener("focusin", E),
              document.removeEventListener("focusout", _),
              X.disconnect());
          }
        );
      }
    }, [o, v, z.paused]),
      b.useEffect(() => {
        if (v) {
          zg.add(z);
          const E = document.activeElement;
          if (!v.contains(E)) {
            const C = new CustomEvent(xc, Ag);
            (v.addEventListener(xc, g),
              v.dispatchEvent(C),
              C.defaultPrevented ||
                (BS(VS(Hp(v)), { select: !0 }),
                document.activeElement === E && Ca(v)));
          }
          return () => {
            (v.removeEventListener(xc, g),
              setTimeout(() => {
                const C = new CustomEvent(Sc, Ag);
                (v.addEventListener(Sc, S),
                  v.dispatchEvent(C),
                  C.defaultPrevented || Ca(E ?? document.body, { select: !0 }),
                  v.removeEventListener(Sc, S),
                  zg.remove(z));
              }, 0));
          };
        }
      }, [v, g, S, z]));
    const A = b.useCallback(
      (E) => {
        if ((!s && !o) || z.paused) return;
        const _ = E.key === "Tab" && !E.altKey && !E.ctrlKey && !E.metaKey,
          C = document.activeElement;
        if (_ && C) {
          const X = E.currentTarget,
            [L, F] = HS(X);
          L && F
            ? !E.shiftKey && C === F
              ? (E.preventDefault(), s && Ca(L, { select: !0 }))
              : E.shiftKey &&
                C === L &&
                (E.preventDefault(), s && Ca(F, { select: !0 }))
            : C === X && E.preventDefault();
        }
      },
      [s, o, z.paused],
    );
    return f.jsx(Et.div, { tabIndex: -1, ...h, ref: N, onKeyDown: A });
  });
Bp.displayName = LS;
function BS(a, { select: i = !1 } = {}) {
  const s = document.activeElement;
  for (const o of a)
    if ((Ca(o, { select: i }), document.activeElement !== s)) return;
}
function HS(a) {
  const i = Hp(a),
    s = Rg(i, a),
    o = Rg(i.reverse(), a);
  return [s, o];
}
function Hp(a) {
  const i = [],
    s = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const c = o.tagName === "INPUT" && o.type === "hidden";
        return o.disabled || o.hidden || c
          ? NodeFilter.FILTER_SKIP
          : o.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; s.nextNode(); ) i.push(s.currentNode);
  return i;
}
function Rg(a, i) {
  for (const s of a) if (!GS(s, { upTo: i })) return s;
}
function GS(a, { upTo: i }) {
  if (getComputedStyle(a).visibility === "hidden") return !0;
  for (; a; ) {
    if (i !== void 0 && a === i) return !1;
    if (getComputedStyle(a).display === "none") return !0;
    a = a.parentElement;
  }
  return !1;
}
function YS(a) {
  return a instanceof HTMLInputElement && "select" in a;
}
function Ca(a, { select: i = !1 } = {}) {
  if (a && a.focus) {
    const s = document.activeElement;
    (a.focus({ preventScroll: !0 }), a !== s && YS(a) && i && a.select());
  }
}
var zg = qS();
function qS() {
  let a = [];
  return {
    add(i) {
      const s = a[0];
      (i !== s && s?.pause(), (a = Mg(a, i)), a.unshift(i));
    },
    remove(i) {
      ((a = Mg(a, i)), a[0]?.resume());
    },
  };
}
function Mg(a, i) {
  const s = [...a],
    o = s.indexOf(i);
  return (o !== -1 && s.splice(o, 1), s);
}
function VS(a) {
  return a.filter((i) => i.tagName !== "A");
}
var XS = "Portal",
  Gp = b.forwardRef((a, i) => {
    const { container: s, ...o } = a,
      [c, d] = b.useState(!1);
    rr(() => d(!0), []);
    const h = s || (c && globalThis?.document?.body);
    return h ? Sp.createPortal(f.jsx(Et.div, { ...o, ref: i }), h) : null;
  });
Gp.displayName = XS;
var Ec = 0;
function QS() {
  b.useEffect(() => {
    const a = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement("afterbegin", a[0] ?? Dg()),
      document.body.insertAdjacentElement("beforeend", a[1] ?? Dg()),
      Ec++,
      () => {
        (Ec === 1 &&
          document
            .querySelectorAll("[data-radix-focus-guard]")
            .forEach((i) => i.remove()),
          Ec--);
      }
    );
  }, []);
}
function Dg() {
  const a = document.createElement("span");
  return (
    a.setAttribute("data-radix-focus-guard", ""),
    (a.tabIndex = 0),
    (a.style.outline = "none"),
    (a.style.opacity = "0"),
    (a.style.position = "fixed"),
    (a.style.pointerEvents = "none"),
    a
  );
}
var Sn = function () {
  return (
    (Sn =
      Object.assign ||
      function (i) {
        for (var s, o = 1, c = arguments.length; o < c; o++) {
          s = arguments[o];
          for (var d in s)
            Object.prototype.hasOwnProperty.call(s, d) && (i[d] = s[d]);
        }
        return i;
      }),
    Sn.apply(this, arguments)
  );
};
function Yp(a, i) {
  var s = {};
  for (var o in a)
    Object.prototype.hasOwnProperty.call(a, o) &&
      i.indexOf(o) < 0 &&
      (s[o] = a[o]);
  if (a != null && typeof Object.getOwnPropertySymbols == "function")
    for (var c = 0, o = Object.getOwnPropertySymbols(a); c < o.length; c++)
      i.indexOf(o[c]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(a, o[c]) &&
        (s[o[c]] = a[o[c]]);
  return s;
}
function ZS(a, i, s) {
  if (s || arguments.length === 2)
    for (var o = 0, c = i.length, d; o < c; o++)
      (d || !(o in i)) &&
        (d || (d = Array.prototype.slice.call(i, 0, o)), (d[o] = i[o]));
  return a.concat(d || Array.prototype.slice.call(i));
}
var Bs = "right-scroll-bar-position",
  Hs = "width-before-scroll-bar",
  KS = "with-scroll-bars-hidden",
  JS = "--removed-body-scroll-bar-size";
function wc(a, i) {
  return (typeof a == "function" ? a(i) : a && (a.current = i), a);
}
function $S(a, i) {
  var s = b.useState(function () {
    return {
      value: a,
      callback: i,
      facade: {
        get current() {
          return s.value;
        },
        set current(o) {
          var c = s.value;
          c !== o && ((s.value = o), s.callback(o, c));
        },
      },
    };
  })[0];
  return ((s.callback = i), s.facade);
}
var FS = typeof window < "u" ? b.useLayoutEffect : b.useEffect,
  Og = new WeakMap();
function WS(a, i) {
  var s = $S(null, function (o) {
    return a.forEach(function (c) {
      return wc(c, o);
    });
  });
  return (
    FS(
      function () {
        var o = Og.get(s);
        if (o) {
          var c = new Set(o),
            d = new Set(a),
            h = s.current;
          (c.forEach(function (v) {
            d.has(v) || wc(v, null);
          }),
            d.forEach(function (v) {
              c.has(v) || wc(v, h);
            }));
        }
        Og.set(s, a);
      },
      [a],
    ),
    s
  );
}
function IS(a) {
  return a;
}
function PS(a, i) {
  i === void 0 && (i = IS);
  var s = [],
    o = !1,
    c = {
      read: function () {
        if (o)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
          );
        return s.length ? s[s.length - 1] : a;
      },
      useMedium: function (d) {
        var h = i(d, o);
        return (
          s.push(h),
          function () {
            s = s.filter(function (v) {
              return v !== h;
            });
          }
        );
      },
      assignSyncMedium: function (d) {
        for (o = !0; s.length; ) {
          var h = s;
          ((s = []), h.forEach(d));
        }
        s = {
          push: function (v) {
            return d(v);
          },
          filter: function () {
            return s;
          },
        };
      },
      assignMedium: function (d) {
        o = !0;
        var h = [];
        if (s.length) {
          var v = s;
          ((s = []), v.forEach(d), (h = s));
        }
        var y = function () {
            var S = h;
            ((h = []), S.forEach(d));
          },
          g = function () {
            return Promise.resolve().then(y);
          };
        (g(),
          (s = {
            push: function (S) {
              (h.push(S), g());
            },
            filter: function (S) {
              return ((h = h.filter(S)), s);
            },
          }));
      },
    };
  return c;
}
function eE(a) {
  a === void 0 && (a = {});
  var i = PS(null);
  return ((i.options = Sn({ async: !0, ssr: !1 }, a)), i);
}
var qp = function (a) {
  var i = a.sideCar,
    s = Yp(a, ["sideCar"]);
  if (!i)
    throw new Error(
      "Sidecar: please provide `sideCar` property to import the right car",
    );
  var o = i.read();
  if (!o) throw new Error("Sidecar medium not found");
  return b.createElement(o, Sn({}, s));
};
qp.isSideCarExport = !0;
function tE(a, i) {
  return (a.useMedium(i), qp);
}
var Vp = eE(),
  Nc = function () {},
  $s = b.forwardRef(function (a, i) {
    var s = b.useRef(null),
      o = b.useState({
        onScrollCapture: Nc,
        onWheelCapture: Nc,
        onTouchMoveCapture: Nc,
      }),
      c = o[0],
      d = o[1],
      h = a.forwardProps,
      v = a.children,
      y = a.className,
      g = a.removeScrollBar,
      S = a.enabled,
      p = a.shards,
      N = a.sideCar,
      z = a.noRelative,
      A = a.noIsolation,
      E = a.inert,
      _ = a.allowPinchZoom,
      C = a.as,
      X = C === void 0 ? "div" : C,
      L = a.gapMode,
      F = Yp(a, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noRelative",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode",
      ]),
      H = N,
      J = WS([s, i]),
      B = Sn(Sn({}, F), c);
    return b.createElement(
      b.Fragment,
      null,
      S &&
        b.createElement(H, {
          sideCar: Vp,
          removeScrollBar: g,
          shards: p,
          noRelative: z,
          noIsolation: A,
          inert: E,
          setCallbacks: d,
          allowPinchZoom: !!_,
          lockRef: s,
          gapMode: L,
        }),
      h
        ? b.cloneElement(b.Children.only(v), Sn(Sn({}, B), { ref: J }))
        : b.createElement(X, Sn({}, B, { className: y, ref: J }), v),
    );
  });
$s.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
$s.classNames = { fullWidth: Hs, zeroRight: Bs };
var nE = function () {
  if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
function aE() {
  if (!document) return null;
  var a = document.createElement("style");
  a.type = "text/css";
  var i = nE();
  return (i && a.setAttribute("nonce", i), a);
}
function lE(a, i) {
  a.styleSheet
    ? (a.styleSheet.cssText = i)
    : a.appendChild(document.createTextNode(i));
}
function iE(a) {
  var i = document.head || document.getElementsByTagName("head")[0];
  i.appendChild(a);
}
var rE = function () {
    var a = 0,
      i = null;
    return {
      add: function (s) {
        (a == 0 && (i = aE()) && (lE(i, s), iE(i)), a++);
      },
      remove: function () {
        (a--,
          !a && i && (i.parentNode && i.parentNode.removeChild(i), (i = null)));
      },
    };
  },
  sE = function () {
    var a = rE();
    return function (i, s) {
      b.useEffect(
        function () {
          return (
            a.add(i),
            function () {
              a.remove();
            }
          );
        },
        [i && s],
      );
    };
  },
  Xp = function () {
    var a = sE(),
      i = function (s) {
        var o = s.styles,
          c = s.dynamic;
        return (a(o, c), null);
      };
    return i;
  },
  oE = { left: 0, top: 0, right: 0, gap: 0 },
  _c = function (a) {
    return parseInt(a || "", 10) || 0;
  },
  uE = function (a) {
    var i = window.getComputedStyle(document.body),
      s = i[a === "padding" ? "paddingLeft" : "marginLeft"],
      o = i[a === "padding" ? "paddingTop" : "marginTop"],
      c = i[a === "padding" ? "paddingRight" : "marginRight"];
    return [_c(s), _c(o), _c(c)];
  },
  cE = function (a) {
    if ((a === void 0 && (a = "margin"), typeof window > "u")) return oE;
    var i = uE(a),
      s = document.documentElement.clientWidth,
      o = window.innerWidth;
    return {
      left: i[0],
      top: i[1],
      right: i[2],
      gap: Math.max(0, o - s + i[2] - i[0]),
    };
  },
  fE = Xp(),
  Pl = "data-scroll-locked",
  dE = function (a, i, s, o) {
    var c = a.left,
      d = a.top,
      h = a.right,
      v = a.gap;
    return (
      s === void 0 && (s = "margin"),
      `
  .`
        .concat(
          KS,
          ` {
   overflow: hidden `,
        )
        .concat(
          o,
          `;
   padding-right: `,
        )
        .concat(v, "px ")
        .concat(
          o,
          `;
  }
  body[`,
        )
        .concat(
          Pl,
          `] {
    overflow: hidden `,
        )
        .concat(
          o,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            i && "position: relative ".concat(o, ";"),
            s === "margin" &&
              `
    padding-left: `
                .concat(
                  c,
                  `px;
    padding-top: `,
                )
                .concat(
                  d,
                  `px;
    padding-right: `,
                )
                .concat(
                  h,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(v, "px ")
                .concat(
                  o,
                  `;
    `,
                ),
            s === "padding" &&
              "padding-right: ".concat(v, "px ").concat(o, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`,
        )
        .concat(
          Bs,
          ` {
    right: `,
        )
        .concat(v, "px ")
        .concat(
          o,
          `;
  }
  
  .`,
        )
        .concat(
          Hs,
          ` {
    margin-right: `,
        )
        .concat(v, "px ")
        .concat(
          o,
          `;
  }
  
  .`,
        )
        .concat(Bs, " .")
        .concat(
          Bs,
          ` {
    right: 0 `,
        )
        .concat(
          o,
          `;
  }
  
  .`,
        )
        .concat(Hs, " .")
        .concat(
          Hs,
          ` {
    margin-right: 0 `,
        )
        .concat(
          o,
          `;
  }
  
  body[`,
        )
        .concat(
          Pl,
          `] {
    `,
        )
        .concat(JS, ": ")
        .concat(
          v,
          `px;
  }
`,
        )
    );
  },
  kg = function () {
    var a = parseInt(document.body.getAttribute(Pl) || "0", 10);
    return isFinite(a) ? a : 0;
  },
  mE = function () {
    b.useEffect(function () {
      return (
        document.body.setAttribute(Pl, (kg() + 1).toString()),
        function () {
          var a = kg() - 1;
          a <= 0
            ? document.body.removeAttribute(Pl)
            : document.body.setAttribute(Pl, a.toString());
        }
      );
    }, []);
  },
  hE = function (a) {
    var i = a.noRelative,
      s = a.noImportant,
      o = a.gapMode,
      c = o === void 0 ? "margin" : o;
    mE();
    var d = b.useMemo(
      function () {
        return cE(c);
      },
      [c],
    );
    return b.createElement(fE, { styles: dE(d, !i, c, s ? "" : "!important") });
  },
  Dc = !1;
if (typeof window < "u")
  try {
    var As = Object.defineProperty({}, "passive", {
      get: function () {
        return ((Dc = !0), !0);
      },
    });
    (window.addEventListener("test", As, As),
      window.removeEventListener("test", As, As));
  } catch {
    Dc = !1;
  }
var Kl = Dc ? { passive: !1 } : !1,
  gE = function (a) {
    return a.tagName === "TEXTAREA";
  },
  Qp = function (a, i) {
    if (!(a instanceof Element)) return !1;
    var s = window.getComputedStyle(a);
    return (
      s[i] !== "hidden" &&
      !(s.overflowY === s.overflowX && !gE(a) && s[i] === "visible")
    );
  },
  pE = function (a) {
    return Qp(a, "overflowY");
  },
  vE = function (a) {
    return Qp(a, "overflowX");
  },
  Ug = function (a, i) {
    var s = i.ownerDocument,
      o = i;
    do {
      typeof ShadowRoot < "u" && o instanceof ShadowRoot && (o = o.host);
      var c = Zp(a, o);
      if (c) {
        var d = Kp(a, o),
          h = d[1],
          v = d[2];
        if (h > v) return !0;
      }
      o = o.parentNode;
    } while (o && o !== s.body);
    return !1;
  },
  bE = function (a) {
    var i = a.scrollTop,
      s = a.scrollHeight,
      o = a.clientHeight;
    return [i, s, o];
  },
  yE = function (a) {
    var i = a.scrollLeft,
      s = a.scrollWidth,
      o = a.clientWidth;
    return [i, s, o];
  },
  Zp = function (a, i) {
    return a === "v" ? pE(i) : vE(i);
  },
  Kp = function (a, i) {
    return a === "v" ? bE(i) : yE(i);
  },
  xE = function (a, i) {
    return a === "h" && i === "rtl" ? -1 : 1;
  },
  SE = function (a, i, s, o, c) {
    var d = xE(a, window.getComputedStyle(i).direction),
      h = d * o,
      v = s.target,
      y = i.contains(v),
      g = !1,
      S = h > 0,
      p = 0,
      N = 0;
    do {
      if (!v) break;
      var z = Kp(a, v),
        A = z[0],
        E = z[1],
        _ = z[2],
        C = E - _ - d * A;
      (A || C) && Zp(a, v) && ((p += C), (N += A));
      var X = v.parentNode;
      v = X && X.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? X.host : X;
    } while ((!y && v !== document.body) || (y && (i.contains(v) || i === v)));
    return (((S && Math.abs(p) < 1) || (!S && Math.abs(N) < 1)) && (g = !0), g);
  },
  Rs = function (a) {
    return "changedTouches" in a
      ? [a.changedTouches[0].clientX, a.changedTouches[0].clientY]
      : [0, 0];
  },
  Lg = function (a) {
    return [a.deltaX, a.deltaY];
  },
  Bg = function (a) {
    return a && "current" in a ? a.current : a;
  },
  EE = function (a, i) {
    return a[0] === i[0] && a[1] === i[1];
  },
  wE = function (a) {
    return `
  .block-interactivity-`
      .concat(
        a,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        a,
        ` {pointer-events: all;}
`,
      );
  },
  NE = 0,
  Jl = [];
function _E(a) {
  var i = b.useRef([]),
    s = b.useRef([0, 0]),
    o = b.useRef(),
    c = b.useState(NE++)[0],
    d = b.useState(Xp)[0],
    h = b.useRef(a);
  (b.useEffect(
    function () {
      h.current = a;
    },
    [a],
  ),
    b.useEffect(
      function () {
        if (a.inert) {
          document.body.classList.add("block-interactivity-".concat(c));
          var E = ZS([a.lockRef.current], (a.shards || []).map(Bg), !0).filter(
            Boolean,
          );
          return (
            E.forEach(function (_) {
              return _.classList.add("allow-interactivity-".concat(c));
            }),
            function () {
              (document.body.classList.remove("block-interactivity-".concat(c)),
                E.forEach(function (_) {
                  return _.classList.remove("allow-interactivity-".concat(c));
                }));
            }
          );
        }
      },
      [a.inert, a.lockRef.current, a.shards],
    ));
  var v = b.useCallback(function (E, _) {
      if (
        ("touches" in E && E.touches.length === 2) ||
        (E.type === "wheel" && E.ctrlKey)
      )
        return !h.current.allowPinchZoom;
      var C = Rs(E),
        X = s.current,
        L = "deltaX" in E ? E.deltaX : X[0] - C[0],
        F = "deltaY" in E ? E.deltaY : X[1] - C[1],
        H,
        J = E.target,
        B = Math.abs(L) > Math.abs(F) ? "h" : "v";
      if ("touches" in E && B === "h" && J.type === "range") return !1;
      var Y = window.getSelection(),
        ee = Y && Y.anchorNode,
        ye = ee ? ee === J || ee.contains(J) : !1;
      if (ye) return !1;
      var pe = Ug(B, J);
      if (!pe) return !0;
      if ((pe ? (H = B) : ((H = B === "v" ? "h" : "v"), (pe = Ug(B, J))), !pe))
        return !1;
      if (
        (!o.current && "changedTouches" in E && (L || F) && (o.current = H), !H)
      )
        return !0;
      var Ee = o.current || H;
      return SE(Ee, _, E, Ee === "h" ? L : F);
    }, []),
    y = b.useCallback(function (E) {
      var _ = E;
      if (!(!Jl.length || Jl[Jl.length - 1] !== d)) {
        var C = "deltaY" in _ ? Lg(_) : Rs(_),
          X = i.current.filter(function (H) {
            return (
              H.name === _.type &&
              (H.target === _.target || _.target === H.shadowParent) &&
              EE(H.delta, C)
            );
          })[0];
        if (X && X.should) {
          _.cancelable && _.preventDefault();
          return;
        }
        if (!X) {
          var L = (h.current.shards || [])
              .map(Bg)
              .filter(Boolean)
              .filter(function (H) {
                return H.contains(_.target);
              }),
            F = L.length > 0 ? v(_, L[0]) : !h.current.noIsolation;
          F && _.cancelable && _.preventDefault();
        }
      }
    }, []),
    g = b.useCallback(function (E, _, C, X) {
      var L = { name: E, delta: _, target: C, should: X, shadowParent: jE(C) };
      (i.current.push(L),
        setTimeout(function () {
          i.current = i.current.filter(function (F) {
            return F !== L;
          });
        }, 1));
    }, []),
    S = b.useCallback(function (E) {
      ((s.current = Rs(E)), (o.current = void 0));
    }, []),
    p = b.useCallback(function (E) {
      g(E.type, Lg(E), E.target, v(E, a.lockRef.current));
    }, []),
    N = b.useCallback(function (E) {
      g(E.type, Rs(E), E.target, v(E, a.lockRef.current));
    }, []);
  b.useEffect(function () {
    return (
      Jl.push(d),
      a.setCallbacks({
        onScrollCapture: p,
        onWheelCapture: p,
        onTouchMoveCapture: N,
      }),
      document.addEventListener("wheel", y, Kl),
      document.addEventListener("touchmove", y, Kl),
      document.addEventListener("touchstart", S, Kl),
      function () {
        ((Jl = Jl.filter(function (E) {
          return E !== d;
        })),
          document.removeEventListener("wheel", y, Kl),
          document.removeEventListener("touchmove", y, Kl),
          document.removeEventListener("touchstart", S, Kl));
      }
    );
  }, []);
  var z = a.removeScrollBar,
    A = a.inert;
  return b.createElement(
    b.Fragment,
    null,
    A ? b.createElement(d, { styles: wE(c) }) : null,
    z
      ? b.createElement(hE, { noRelative: a.noRelative, gapMode: a.gapMode })
      : null,
  );
}
function jE(a) {
  for (var i = null; a !== null; )
    (a instanceof ShadowRoot && ((i = a.host), (a = a.host)),
      (a = a.parentNode));
  return i;
}
const TE = tE(Vp, _E);
var Jp = b.forwardRef(function (a, i) {
  return b.createElement($s, Sn({}, a, { ref: i, sideCar: TE }));
});
Jp.classNames = $s.classNames;
var CE = function (a) {
    if (typeof document > "u") return null;
    var i = Array.isArray(a) ? a[0] : a;
    return i.ownerDocument.body;
  },
  $l = new WeakMap(),
  zs = new WeakMap(),
  Ms = {},
  jc = 0,
  $p = function (a) {
    return a && (a.host || $p(a.parentNode));
  },
  AE = function (a, i) {
    return i
      .map(function (s) {
        if (a.contains(s)) return s;
        var o = $p(s);
        return o && a.contains(o)
          ? o
          : (console.error(
              "aria-hidden",
              s,
              "in not contained inside",
              a,
              ". Doing nothing",
            ),
            null);
      })
      .filter(function (s) {
        return !!s;
      });
  },
  RE = function (a, i, s, o) {
    var c = AE(i, Array.isArray(a) ? a : [a]);
    Ms[s] || (Ms[s] = new WeakMap());
    var d = Ms[s],
      h = [],
      v = new Set(),
      y = new Set(c),
      g = function (p) {
        !p || v.has(p) || (v.add(p), g(p.parentNode));
      };
    c.forEach(g);
    var S = function (p) {
      !p ||
        y.has(p) ||
        Array.prototype.forEach.call(p.children, function (N) {
          if (v.has(N)) S(N);
          else
            try {
              var z = N.getAttribute(o),
                A = z !== null && z !== "false",
                E = ($l.get(N) || 0) + 1,
                _ = (d.get(N) || 0) + 1;
              ($l.set(N, E),
                d.set(N, _),
                h.push(N),
                E === 1 && A && zs.set(N, !0),
                _ === 1 && N.setAttribute(s, "true"),
                A || N.setAttribute(o, "true"));
            } catch (C) {
              console.error("aria-hidden: cannot operate on ", N, C);
            }
        });
    };
    return (
      S(i),
      v.clear(),
      jc++,
      function () {
        (h.forEach(function (p) {
          var N = $l.get(p) - 1,
            z = d.get(p) - 1;
          ($l.set(p, N),
            d.set(p, z),
            N || (zs.has(p) || p.removeAttribute(o), zs.delete(p)),
            z || p.removeAttribute(s));
        }),
          jc--,
          jc ||
            (($l = new WeakMap()),
            ($l = new WeakMap()),
            (zs = new WeakMap()),
            (Ms = {})));
      }
    );
  },
  zE = function (a, i, s) {
    s === void 0 && (s = "data-aria-hidden");
    var o = Array.from(Array.isArray(a) ? a : [a]),
      c = CE(a);
    return c
      ? (o.push.apply(o, Array.from(c.querySelectorAll("[aria-live], script"))),
        RE(o, c, s, "aria-hidden"))
      : function () {
          return null;
        };
  },
  Fs = "Dialog",
  [Fp] = Js(Fs),
  [ME, mn] = Fp(Fs),
  Wp = (a) => {
    const {
        __scopeDialog: i,
        children: s,
        open: o,
        defaultOpen: c,
        onOpenChange: d,
        modal: h = !0,
      } = a,
      v = b.useRef(null),
      y = b.useRef(null),
      [g, S] = Kc({ prop: o, defaultProp: c ?? !1, onChange: d, caller: Fs });
    return f.jsx(ME, {
      scope: i,
      triggerRef: v,
      contentRef: y,
      contentId: ar(),
      titleId: ar(),
      descriptionId: ar(),
      open: g,
      onOpenChange: S,
      onOpenToggle: b.useCallback(() => S((p) => !p), [S]),
      modal: h,
      children: s,
    });
  };
Wp.displayName = Fs;
var Ip = "DialogTrigger",
  Pp = b.forwardRef((a, i) => {
    const { __scopeDialog: s, ...o } = a,
      c = mn(Ip, s),
      d = Nn(i, c.triggerRef);
    return f.jsx(Et.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": c.open,
      "aria-controls": c.contentId,
      "data-state": Fc(c.open),
      ...o,
      ref: d,
      onClick: pt(a.onClick, c.onOpenToggle),
    });
  });
Pp.displayName = Ip;
var Jc = "DialogPortal",
  [DE, ev] = Fp(Jc, { forceMount: void 0 }),
  tv = (a) => {
    const { __scopeDialog: i, forceMount: s, children: o, container: c } = a,
      d = mn(Jc, i);
    return f.jsx(DE, {
      scope: i,
      forceMount: s,
      children: b.Children.map(o, (h) =>
        f.jsx(cr, {
          present: s || d.open,
          children: f.jsx(Gp, { asChild: !0, container: c, children: h }),
        }),
      ),
    });
  };
tv.displayName = Jc;
var Ys = "DialogOverlay",
  nv = b.forwardRef((a, i) => {
    const s = ev(Ys, a.__scopeDialog),
      { forceMount: o = s.forceMount, ...c } = a,
      d = mn(Ys, a.__scopeDialog);
    return d.modal
      ? f.jsx(cr, {
          present: o || d.open,
          children: f.jsx(kE, { ...c, ref: i }),
        })
      : null;
  });
nv.displayName = Ys;
var OE = ir("DialogOverlay.RemoveScroll"),
  kE = b.forwardRef((a, i) => {
    const { __scopeDialog: s, ...o } = a,
      c = mn(Ys, s);
    return f.jsx(Jp, {
      as: OE,
      allowPinchZoom: !0,
      shards: [c.contentRef],
      children: f.jsx(Et.div, {
        "data-state": Fc(c.open),
        ...o,
        ref: i,
        style: { pointerEvents: "auto", ...o.style },
      }),
    });
  }),
  nl = "DialogContent",
  av = b.forwardRef((a, i) => {
    const s = ev(nl, a.__scopeDialog),
      { forceMount: o = s.forceMount, ...c } = a,
      d = mn(nl, a.__scopeDialog);
    return f.jsx(cr, {
      present: o || d.open,
      children: d.modal
        ? f.jsx(UE, { ...c, ref: i })
        : f.jsx(LE, { ...c, ref: i }),
    });
  });
av.displayName = nl;
var UE = b.forwardRef((a, i) => {
    const s = mn(nl, a.__scopeDialog),
      o = b.useRef(null),
      c = Nn(i, s.contentRef, o);
    return (
      b.useEffect(() => {
        const d = o.current;
        if (d) return zE(d);
      }, []),
      f.jsx(lv, {
        ...a,
        ref: c,
        trapFocus: s.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: pt(a.onCloseAutoFocus, (d) => {
          (d.preventDefault(), s.triggerRef.current?.focus());
        }),
        onPointerDownOutside: pt(a.onPointerDownOutside, (d) => {
          const h = d.detail.originalEvent,
            v = h.button === 0 && h.ctrlKey === !0;
          (h.button === 2 || v) && d.preventDefault();
        }),
        onFocusOutside: pt(a.onFocusOutside, (d) => d.preventDefault()),
      })
    );
  }),
  LE = b.forwardRef((a, i) => {
    const s = mn(nl, a.__scopeDialog),
      o = b.useRef(!1),
      c = b.useRef(!1);
    return f.jsx(lv, {
      ...a,
      ref: i,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (d) => {
        (a.onCloseAutoFocus?.(d),
          d.defaultPrevented ||
            (o.current || s.triggerRef.current?.focus(), d.preventDefault()),
          (o.current = !1),
          (c.current = !1));
      },
      onInteractOutside: (d) => {
        (a.onInteractOutside?.(d),
          d.defaultPrevented ||
            ((o.current = !0),
            d.detail.originalEvent.type === "pointerdown" && (c.current = !0)));
        const h = d.target;
        (s.triggerRef.current?.contains(h) && d.preventDefault(),
          d.detail.originalEvent.type === "focusin" &&
            c.current &&
            d.preventDefault());
      },
    });
  }),
  lv = b.forwardRef((a, i) => {
    const {
        __scopeDialog: s,
        trapFocus: o,
        onOpenAutoFocus: c,
        onCloseAutoFocus: d,
        ...h
      } = a,
      v = mn(nl, s),
      y = b.useRef(null),
      g = Nn(i, y);
    return (
      QS(),
      f.jsxs(f.Fragment, {
        children: [
          f.jsx(Bp, {
            asChild: !0,
            loop: !0,
            trapped: o,
            onMountAutoFocus: c,
            onUnmountAutoFocus: d,
            children: f.jsx(Up, {
              role: "dialog",
              id: v.contentId,
              "aria-describedby": v.descriptionId,
              "aria-labelledby": v.titleId,
              "data-state": Fc(v.open),
              ...h,
              ref: g,
              onDismiss: () => v.onOpenChange(!1),
            }),
          }),
          f.jsxs(f.Fragment, {
            children: [
              f.jsx(BE, { titleId: v.titleId }),
              f.jsx(GE, { contentRef: y, descriptionId: v.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  $c = "DialogTitle",
  iv = b.forwardRef((a, i) => {
    const { __scopeDialog: s, ...o } = a,
      c = mn($c, s);
    return f.jsx(Et.h2, { id: c.titleId, ...o, ref: i });
  });
iv.displayName = $c;
var rv = "DialogDescription",
  sv = b.forwardRef((a, i) => {
    const { __scopeDialog: s, ...o } = a,
      c = mn(rv, s);
    return f.jsx(Et.p, { id: c.descriptionId, ...o, ref: i });
  });
sv.displayName = rv;
var ov = "DialogClose",
  uv = b.forwardRef((a, i) => {
    const { __scopeDialog: s, ...o } = a,
      c = mn(ov, s);
    return f.jsx(Et.button, {
      type: "button",
      ...o,
      ref: i,
      onClick: pt(a.onClick, () => c.onOpenChange(!1)),
    });
  });
uv.displayName = ov;
function Fc(a) {
  return a ? "open" : "closed";
}
var cv = "DialogTitleWarning",
  [AN, fv] = vS(cv, { contentName: nl, titleName: $c, docsSlug: "dialog" }),
  BE = ({ titleId: a }) => {
    const i = fv(cv),
      s = `\`${i.contentName}\` requires a \`${i.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${i.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${i.docsSlug}`;
    return (
      b.useEffect(() => {
        a && (document.getElementById(a) || console.error(s));
      }, [s, a]),
      null
    );
  },
  HE = "DialogDescriptionWarning",
  GE = ({ contentRef: a, descriptionId: i }) => {
    const o = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${fv(HE).contentName}}.`;
    return (
      b.useEffect(() => {
        const c = a.current?.getAttribute("aria-describedby");
        i && c && (document.getElementById(i) || console.warn(o));
      }, [o, a, i]),
      null
    );
  },
  YE = Wp,
  qE = Pp,
  VE = tv,
  XE = nv,
  QE = av,
  ZE = iv,
  KE = sv,
  dv = uv,
  Tc = "rovingFocusGroup.onEntryFocus",
  JE = { bubbles: !1, cancelable: !0 },
  fr = "RovingFocusGroup",
  [Oc, mv, $E] = yS(fr),
  [FE, hv] = Js(fr, [$E]),
  [WE, IE] = FE(fr),
  gv = b.forwardRef((a, i) =>
    f.jsx(Oc.Provider, {
      scope: a.__scopeRovingFocusGroup,
      children: f.jsx(Oc.Slot, {
        scope: a.__scopeRovingFocusGroup,
        children: f.jsx(PE, { ...a, ref: i }),
      }),
    }),
  );
gv.displayName = fr;
var PE = b.forwardRef((a, i) => {
    const {
        __scopeRovingFocusGroup: s,
        orientation: o,
        loop: c = !1,
        dir: d,
        currentTabStopId: h,
        defaultCurrentTabStopId: v,
        onCurrentTabStopIdChange: y,
        onEntryFocus: g,
        preventScrollOnEntryFocus: S = !1,
        ...p
      } = a,
      N = b.useRef(null),
      z = Nn(i, N),
      A = Op(d),
      [E, _] = Kc({ prop: h, defaultProp: v ?? null, onChange: y, caller: fr }),
      [C, X] = b.useState(!1),
      L = ti(g),
      F = mv(s),
      H = b.useRef(!1),
      [J, B] = b.useState(0);
    return (
      b.useEffect(() => {
        const Y = N.current;
        if (Y)
          return (
            Y.addEventListener(Tc, L),
            () => Y.removeEventListener(Tc, L)
          );
      }, [L]),
      f.jsx(WE, {
        scope: s,
        orientation: o,
        dir: A,
        loop: c,
        currentTabStopId: E,
        onItemFocus: b.useCallback((Y) => _(Y), [_]),
        onItemShiftTab: b.useCallback(() => X(!0), []),
        onFocusableItemAdd: b.useCallback(() => B((Y) => Y + 1), []),
        onFocusableItemRemove: b.useCallback(() => B((Y) => Y - 1), []),
        children: f.jsx(Et.div, {
          tabIndex: C || J === 0 ? -1 : 0,
          "data-orientation": o,
          ...p,
          ref: z,
          style: { outline: "none", ...a.style },
          onMouseDown: pt(a.onMouseDown, () => {
            H.current = !0;
          }),
          onFocus: pt(a.onFocus, (Y) => {
            const ee = !H.current;
            if (Y.target === Y.currentTarget && ee && !C) {
              const ye = new CustomEvent(Tc, JE);
              if ((Y.currentTarget.dispatchEvent(ye), !ye.defaultPrevented)) {
                const pe = F().filter((M) => M.focusable),
                  Ee = pe.find((M) => M.active),
                  Le = pe.find((M) => M.id === E),
                  je = [Ee, Le, ...pe]
                    .filter(Boolean)
                    .map((M) => M.ref.current);
                bv(je, S);
              }
            }
            H.current = !1;
          }),
          onBlur: pt(a.onBlur, () => X(!1)),
        }),
      })
    );
  }),
  pv = "RovingFocusGroupItem",
  vv = b.forwardRef((a, i) => {
    const {
        __scopeRovingFocusGroup: s,
        focusable: o = !0,
        active: c = !1,
        tabStopId: d,
        children: h,
        ...v
      } = a,
      y = ar(),
      g = d || y,
      S = IE(pv, s),
      p = S.currentTabStopId === g,
      N = mv(s),
      {
        onFocusableItemAdd: z,
        onFocusableItemRemove: A,
        currentTabStopId: E,
      } = S;
    return (
      b.useEffect(() => {
        if (o) return (z(), () => A());
      }, [o, z, A]),
      f.jsx(Oc.ItemSlot, {
        scope: s,
        id: g,
        focusable: o,
        active: c,
        children: f.jsx(Et.span, {
          tabIndex: p ? 0 : -1,
          "data-orientation": S.orientation,
          ...v,
          ref: i,
          onMouseDown: pt(a.onMouseDown, (_) => {
            o ? S.onItemFocus(g) : _.preventDefault();
          }),
          onFocus: pt(a.onFocus, () => S.onItemFocus(g)),
          onKeyDown: pt(a.onKeyDown, (_) => {
            if (_.key === "Tab" && _.shiftKey) {
              S.onItemShiftTab();
              return;
            }
            if (_.target !== _.currentTarget) return;
            const C = n2(_, S.orientation, S.dir);
            if (C !== void 0) {
              if (_.metaKey || _.ctrlKey || _.altKey || _.shiftKey) return;
              _.preventDefault();
              let L = N()
                .filter((F) => F.focusable)
                .map((F) => F.ref.current);
              if (C === "last") L.reverse();
              else if (C === "prev" || C === "next") {
                C === "prev" && L.reverse();
                const F = L.indexOf(_.currentTarget);
                L = S.loop ? a2(L, F + 1) : L.slice(F + 1);
              }
              setTimeout(() => bv(L));
            }
          }),
          children:
            typeof h == "function"
              ? h({ isCurrentTabStop: p, hasTabStop: E != null })
              : h,
        }),
      })
    );
  });
vv.displayName = pv;
var e2 = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last",
};
function t2(a, i) {
  return i !== "rtl"
    ? a
    : a === "ArrowLeft"
      ? "ArrowRight"
      : a === "ArrowRight"
        ? "ArrowLeft"
        : a;
}
function n2(a, i, s) {
  const o = t2(a.key, s);
  if (
    !(i === "vertical" && ["ArrowLeft", "ArrowRight"].includes(o)) &&
    !(i === "horizontal" && ["ArrowUp", "ArrowDown"].includes(o))
  )
    return e2[o];
}
function bv(a, i = !1) {
  const s = document.activeElement;
  for (const o of a)
    if (
      o === s ||
      (o.focus({ preventScroll: i }), document.activeElement !== s)
    )
      return;
}
function a2(a, i) {
  return a.map((s, o) => a[(i + o) % a.length]);
}
var l2 = gv,
  i2 = vv,
  r2 = "Label",
  yv = b.forwardRef((a, i) =>
    f.jsx(Et.label, {
      ...a,
      ref: i,
      onMouseDown: (s) => {
        s.target.closest("button, input, select, textarea") ||
          (a.onMouseDown?.(s),
          !s.defaultPrevented && s.detail > 1 && s.preventDefault());
      },
    }),
  );
yv.displayName = r2;
var s2 = yv,
  Ws = "Tabs",
  [o2] = Js(Ws, [hv]),
  xv = hv(),
  [u2, Wc] = o2(Ws),
  Sv = b.forwardRef((a, i) => {
    const {
        __scopeTabs: s,
        value: o,
        onValueChange: c,
        defaultValue: d,
        orientation: h = "horizontal",
        dir: v,
        activationMode: y = "automatic",
        ...g
      } = a,
      S = Op(v),
      [p, N] = Kc({ prop: o, onChange: c, defaultProp: d ?? "", caller: Ws });
    return f.jsx(u2, {
      scope: s,
      baseId: ar(),
      value: p,
      onValueChange: N,
      orientation: h,
      dir: S,
      activationMode: y,
      children: f.jsx(Et.div, { dir: S, "data-orientation": h, ...g, ref: i }),
    });
  });
Sv.displayName = Ws;
var Ev = "TabsList",
  wv = b.forwardRef((a, i) => {
    const { __scopeTabs: s, loop: o = !0, ...c } = a,
      d = Wc(Ev, s),
      h = xv(s);
    return f.jsx(l2, {
      asChild: !0,
      ...h,
      orientation: d.orientation,
      dir: d.dir,
      loop: o,
      children: f.jsx(Et.div, {
        role: "tablist",
        "aria-orientation": d.orientation,
        ...c,
        ref: i,
      }),
    });
  });
wv.displayName = Ev;
var Nv = "TabsTrigger",
  _v = b.forwardRef((a, i) => {
    const { __scopeTabs: s, value: o, disabled: c = !1, ...d } = a,
      h = Wc(Nv, s),
      v = xv(s),
      y = Cv(h.baseId, o),
      g = Av(h.baseId, o),
      S = o === h.value;
    return f.jsx(i2, {
      asChild: !0,
      ...v,
      focusable: !c,
      active: S,
      children: f.jsx(Et.button, {
        type: "button",
        role: "tab",
        "aria-selected": S,
        "aria-controls": g,
        "data-state": S ? "active" : "inactive",
        "data-disabled": c ? "" : void 0,
        disabled: c,
        id: y,
        ...d,
        ref: i,
        onMouseDown: pt(a.onMouseDown, (p) => {
          !c && p.button === 0 && p.ctrlKey === !1
            ? h.onValueChange(o)
            : p.preventDefault();
        }),
        onKeyDown: pt(a.onKeyDown, (p) => {
          [" ", "Enter"].includes(p.key) && h.onValueChange(o);
        }),
        onFocus: pt(a.onFocus, () => {
          const p = h.activationMode !== "manual";
          !S && !c && p && h.onValueChange(o);
        }),
      }),
    });
  });
_v.displayName = Nv;
var jv = "TabsContent",
  Tv = b.forwardRef((a, i) => {
    const { __scopeTabs: s, value: o, forceMount: c, children: d, ...h } = a,
      v = Wc(jv, s),
      y = Cv(v.baseId, o),
      g = Av(v.baseId, o),
      S = o === v.value,
      p = b.useRef(S);
    return (
      b.useEffect(() => {
        const N = requestAnimationFrame(() => (p.current = !1));
        return () => cancelAnimationFrame(N);
      }, []),
      f.jsx(cr, {
        present: c || S,
        children: ({ present: N }) =>
          f.jsx(Et.div, {
            "data-state": S ? "active" : "inactive",
            "data-orientation": v.orientation,
            role: "tabpanel",
            "aria-labelledby": y,
            hidden: !N,
            id: g,
            tabIndex: 0,
            ...h,
            ref: i,
            style: { ...a.style, animationDuration: p.current ? "0s" : void 0 },
            children: N && d,
          }),
      })
    );
  });
Tv.displayName = jv;
function Cv(a, i) {
  return `${a}-trigger-${i}`;
}
function Av(a, i) {
  return `${a}-content-${i}`;
}
var c2 = Sv,
  f2 = wv,
  d2 = _v,
  m2 = Tv;
const h2 = (a, i) => {
    const s = new Array(a.length + i.length);
    for (let o = 0; o < a.length; o++) s[o] = a[o];
    for (let o = 0; o < i.length; o++) s[a.length + o] = i[o];
    return s;
  },
  g2 = (a, i) => ({ classGroupId: a, validator: i }),
  Rv = (a = new Map(), i = null, s) => ({
    nextPart: a,
    validators: i,
    classGroupId: s,
  }),
  qs = "-",
  Hg = [],
  p2 = "arbitrary..",
  v2 = (a) => {
    const i = y2(a),
      { conflictingClassGroups: s, conflictingClassGroupModifiers: o } = a;
    return {
      getClassGroupId: (h) => {
        if (h.startsWith("[") && h.endsWith("]")) return b2(h);
        const v = h.split(qs),
          y = v[0] === "" && v.length > 1 ? 1 : 0;
        return zv(v, y, i);
      },
      getConflictingClassGroupIds: (h, v) => {
        if (v) {
          const y = o[h],
            g = s[h];
          return y ? (g ? h2(g, y) : y) : g || Hg;
        }
        return s[h] || Hg;
      },
    };
  },
  zv = (a, i, s) => {
    if (a.length - i === 0) return s.classGroupId;
    const c = a[i],
      d = s.nextPart.get(c);
    if (d) {
      const g = zv(a, i + 1, d);
      if (g) return g;
    }
    const h = s.validators;
    if (h === null) return;
    const v = i === 0 ? a.join(qs) : a.slice(i).join(qs),
      y = h.length;
    for (let g = 0; g < y; g++) {
      const S = h[g];
      if (S.validator(v)) return S.classGroupId;
    }
  },
  b2 = (a) =>
    a.slice(1, -1).indexOf(":") === -1
      ? void 0
      : (() => {
          const i = a.slice(1, -1),
            s = i.indexOf(":"),
            o = i.slice(0, s);
          return o ? p2 + o : void 0;
        })(),
  y2 = (a) => {
    const { theme: i, classGroups: s } = a;
    return x2(s, i);
  },
  x2 = (a, i) => {
    const s = Rv();
    for (const o in a) {
      const c = a[o];
      Ic(c, s, o, i);
    }
    return s;
  },
  Ic = (a, i, s, o) => {
    const c = a.length;
    for (let d = 0; d < c; d++) {
      const h = a[d];
      S2(h, i, s, o);
    }
  },
  S2 = (a, i, s, o) => {
    if (typeof a == "string") {
      E2(a, i, s);
      return;
    }
    if (typeof a == "function") {
      w2(a, i, s, o);
      return;
    }
    N2(a, i, s, o);
  },
  E2 = (a, i, s) => {
    const o = a === "" ? i : Mv(i, a);
    o.classGroupId = s;
  },
  w2 = (a, i, s, o) => {
    if (_2(a)) {
      Ic(a(o), i, s, o);
      return;
    }
    (i.validators === null && (i.validators = []), i.validators.push(g2(s, a)));
  },
  N2 = (a, i, s, o) => {
    const c = Object.entries(a),
      d = c.length;
    for (let h = 0; h < d; h++) {
      const [v, y] = c[h];
      Ic(y, Mv(i, v), s, o);
    }
  },
  Mv = (a, i) => {
    let s = a;
    const o = i.split(qs),
      c = o.length;
    for (let d = 0; d < c; d++) {
      const h = o[d];
      let v = s.nextPart.get(h);
      (v || ((v = Rv()), s.nextPart.set(h, v)), (s = v));
    }
    return s;
  },
  _2 = (a) => "isThemeGetter" in a && a.isThemeGetter === !0,
  j2 = (a) => {
    if (a < 1) return { get: () => {}, set: () => {} };
    let i = 0,
      s = Object.create(null),
      o = Object.create(null);
    const c = (d, h) => {
      ((s[d] = h), i++, i > a && ((i = 0), (o = s), (s = Object.create(null))));
    };
    return {
      get(d) {
        let h = s[d];
        if (h !== void 0) return h;
        if ((h = o[d]) !== void 0) return (c(d, h), h);
      },
      set(d, h) {
        d in s ? (s[d] = h) : c(d, h);
      },
    };
  },
  kc = "!",
  Gg = ":",
  T2 = [],
  Yg = (a, i, s, o, c) => ({
    modifiers: a,
    hasImportantModifier: i,
    baseClassName: s,
    maybePostfixModifierPosition: o,
    isExternal: c,
  }),
  C2 = (a) => {
    const { prefix: i, experimentalParseClassName: s } = a;
    let o = (c) => {
      const d = [];
      let h = 0,
        v = 0,
        y = 0,
        g;
      const S = c.length;
      for (let E = 0; E < S; E++) {
        const _ = c[E];
        if (h === 0 && v === 0) {
          if (_ === Gg) {
            (d.push(c.slice(y, E)), (y = E + 1));
            continue;
          }
          if (_ === "/") {
            g = E;
            continue;
          }
        }
        _ === "[" ? h++ : _ === "]" ? h-- : _ === "(" ? v++ : _ === ")" && v--;
      }
      const p = d.length === 0 ? c : c.slice(y);
      let N = p,
        z = !1;
      p.endsWith(kc)
        ? ((N = p.slice(0, -1)), (z = !0))
        : p.startsWith(kc) && ((N = p.slice(1)), (z = !0));
      const A = g && g > y ? g - y : void 0;
      return Yg(d, z, N, A);
    };
    if (i) {
      const c = i + Gg,
        d = o;
      o = (h) =>
        h.startsWith(c) ? d(h.slice(c.length)) : Yg(T2, !1, h, void 0, !0);
    }
    if (s) {
      const c = o;
      o = (d) => s({ className: d, parseClassName: c });
    }
    return o;
  },
  A2 = (a) => {
    const i = new Map();
    return (
      a.orderSensitiveModifiers.forEach((s, o) => {
        i.set(s, 1e6 + o);
      }),
      (s) => {
        const o = [];
        let c = [];
        for (let d = 0; d < s.length; d++) {
          const h = s[d],
            v = h[0] === "[",
            y = i.has(h);
          v || y
            ? (c.length > 0 && (c.sort(), o.push(...c), (c = [])), o.push(h))
            : c.push(h);
        }
        return (c.length > 0 && (c.sort(), o.push(...c)), o);
      }
    );
  },
  R2 = (a) => ({
    cache: j2(a.cacheSize),
    parseClassName: C2(a),
    sortModifiers: A2(a),
    ...v2(a),
  }),
  z2 = /\s+/,
  M2 = (a, i) => {
    const {
        parseClassName: s,
        getClassGroupId: o,
        getConflictingClassGroupIds: c,
        sortModifiers: d,
      } = i,
      h = [],
      v = a.trim().split(z2);
    let y = "";
    for (let g = v.length - 1; g >= 0; g -= 1) {
      const S = v[g],
        {
          isExternal: p,
          modifiers: N,
          hasImportantModifier: z,
          baseClassName: A,
          maybePostfixModifierPosition: E,
        } = s(S);
      if (p) {
        y = S + (y.length > 0 ? " " + y : y);
        continue;
      }
      let _ = !!E,
        C = o(_ ? A.substring(0, E) : A);
      if (!C) {
        if (!_) {
          y = S + (y.length > 0 ? " " + y : y);
          continue;
        }
        if (((C = o(A)), !C)) {
          y = S + (y.length > 0 ? " " + y : y);
          continue;
        }
        _ = !1;
      }
      const X = N.length === 0 ? "" : N.length === 1 ? N[0] : d(N).join(":"),
        L = z ? X + kc : X,
        F = L + C;
      if (h.indexOf(F) > -1) continue;
      h.push(F);
      const H = c(C, _);
      for (let J = 0; J < H.length; ++J) {
        const B = H[J];
        h.push(L + B);
      }
      y = S + (y.length > 0 ? " " + y : y);
    }
    return y;
  },
  D2 = (...a) => {
    let i = 0,
      s,
      o,
      c = "";
    for (; i < a.length; )
      (s = a[i++]) && (o = Dv(s)) && (c && (c += " "), (c += o));
    return c;
  },
  Dv = (a) => {
    if (typeof a == "string") return a;
    let i,
      s = "";
    for (let o = 0; o < a.length; o++)
      a[o] && (i = Dv(a[o])) && (s && (s += " "), (s += i));
    return s;
  },
  O2 = (a, ...i) => {
    let s, o, c, d;
    const h = (y) => {
        const g = i.reduce((S, p) => p(S), a());
        return (
          (s = R2(g)),
          (o = s.cache.get),
          (c = s.cache.set),
          (d = v),
          v(y)
        );
      },
      v = (y) => {
        const g = o(y);
        if (g) return g;
        const S = M2(y, s);
        return (c(y, S), S);
      };
    return ((d = h), (...y) => d(D2(...y)));
  },
  k2 = [],
  it = (a) => {
    const i = (s) => s[a] || k2;
    return ((i.isThemeGetter = !0), i);
  },
  Ov = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  kv = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  U2 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  L2 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  B2 =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  H2 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  G2 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  Y2 =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  ja = (a) => U2.test(a),
  be = (a) => !!a && !Number.isNaN(Number(a)),
  Ta = (a) => !!a && Number.isInteger(Number(a)),
  Cc = (a) => a.endsWith("%") && be(a.slice(0, -1)),
  Xn = (a) => L2.test(a),
  Uv = () => !0,
  q2 = (a) => B2.test(a) && !H2.test(a),
  Pc = () => !1,
  V2 = (a) => G2.test(a),
  X2 = (a) => Y2.test(a),
  Q2 = (a) => !ae(a) && !le(a),
  Z2 = (a) => Aa(a, Hv, Pc),
  ae = (a) => Ov.test(a),
  el = (a) => Aa(a, Gv, q2),
  qg = (a) => Aa(a, ew, be),
  K2 = (a) => Aa(a, qv, Uv),
  J2 = (a) => Aa(a, Yv, Pc),
  Vg = (a) => Aa(a, Lv, Pc),
  $2 = (a) => Aa(a, Bv, X2),
  Ds = (a) => Aa(a, Vv, V2),
  le = (a) => kv.test(a),
  nr = (a) => ll(a, Gv),
  F2 = (a) => ll(a, Yv),
  Xg = (a) => ll(a, Lv),
  W2 = (a) => ll(a, Hv),
  I2 = (a) => ll(a, Bv),
  Os = (a) => ll(a, Vv, !0),
  P2 = (a) => ll(a, qv, !0),
  Aa = (a, i, s) => {
    const o = Ov.exec(a);
    return o ? (o[1] ? i(o[1]) : s(o[2])) : !1;
  },
  ll = (a, i, s = !1) => {
    const o = kv.exec(a);
    return o ? (o[1] ? i(o[1]) : s) : !1;
  },
  Lv = (a) => a === "position" || a === "percentage",
  Bv = (a) => a === "image" || a === "url",
  Hv = (a) => a === "length" || a === "size" || a === "bg-size",
  Gv = (a) => a === "length",
  ew = (a) => a === "number",
  Yv = (a) => a === "family-name",
  qv = (a) => a === "number" || a === "weight",
  Vv = (a) => a === "shadow",
  tw = () => {
    const a = it("color"),
      i = it("font"),
      s = it("text"),
      o = it("font-weight"),
      c = it("tracking"),
      d = it("leading"),
      h = it("breakpoint"),
      v = it("container"),
      y = it("spacing"),
      g = it("radius"),
      S = it("shadow"),
      p = it("inset-shadow"),
      N = it("text-shadow"),
      z = it("drop-shadow"),
      A = it("blur"),
      E = it("perspective"),
      _ = it("aspect"),
      C = it("ease"),
      X = it("animate"),
      L = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      F = () => [
        "center",
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "left-top",
        "top-right",
        "right-top",
        "bottom-right",
        "right-bottom",
        "bottom-left",
        "left-bottom",
      ],
      H = () => [...F(), le, ae],
      J = () => ["auto", "hidden", "clip", "visible", "scroll"],
      B = () => ["auto", "contain", "none"],
      Y = () => [le, ae, y],
      ee = () => [ja, "full", "auto", ...Y()],
      ye = () => [Ta, "none", "subgrid", le, ae],
      pe = () => ["auto", { span: ["full", Ta, le, ae] }, Ta, le, ae],
      Ee = () => [Ta, "auto", le, ae],
      Le = () => ["auto", "min", "max", "fr", le, ae],
      Qe = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
        "baseline",
        "center-safe",
        "end-safe",
      ],
      je = () => [
        "start",
        "end",
        "center",
        "stretch",
        "center-safe",
        "end-safe",
      ],
      M = () => ["auto", ...Y()],
      K = () => [
        ja,
        "auto",
        "full",
        "dvw",
        "dvh",
        "lvw",
        "lvh",
        "svw",
        "svh",
        "min",
        "max",
        "fit",
        ...Y(),
      ],
      ie = () => [
        ja,
        "screen",
        "full",
        "dvw",
        "lvw",
        "svw",
        "min",
        "max",
        "fit",
        ...Y(),
      ],
      ve = () => [
        ja,
        "screen",
        "full",
        "lh",
        "dvh",
        "lvh",
        "svh",
        "min",
        "max",
        "fit",
        ...Y(),
      ],
      W = () => [a, le, ae],
      j = () => [...F(), Xg, Vg, { position: [le, ae] }],
      q = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
      Z = () => ["auto", "cover", "contain", W2, Z2, { size: [le, ae] }],
      I = () => [Cc, nr, el],
      P = () => ["", "none", "full", g, le, ae],
      te = () => ["", be, nr, el],
      me = () => ["solid", "dashed", "dotted", "double"],
      de = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      ue = () => [be, Cc, Xg, Vg],
      Gt = () => ["", "none", A, le, ae],
      Ct = () => ["none", be, le, ae],
      wt = () => ["none", be, le, ae],
      In = () => [be, le, ae],
      bt = () => [ja, "full", ...Y()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [Xn],
        breakpoint: [Xn],
        color: [Uv],
        container: [Xn],
        "drop-shadow": [Xn],
        ease: ["in", "out", "in-out"],
        font: [Q2],
        "font-weight": [
          "thin",
          "extralight",
          "light",
          "normal",
          "medium",
          "semibold",
          "bold",
          "extrabold",
          "black",
        ],
        "inset-shadow": [Xn],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: [
          "dramatic",
          "near",
          "normal",
          "midrange",
          "distant",
          "none",
        ],
        radius: [Xn],
        shadow: [Xn],
        spacing: ["px", be],
        text: [Xn],
        "text-shadow": [Xn],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", ja, ae, le, _] }],
        container: ["container"],
        columns: [{ columns: [be, ae, le, v] }],
        "break-after": [{ "break-after": L() }],
        "break-before": [{ "break-before": L() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        sr: ["sr-only", "not-sr-only"],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: H() }],
        overflow: [{ overflow: J() }],
        "overflow-x": [{ "overflow-x": J() }],
        "overflow-y": [{ "overflow-y": J() }],
        overscroll: [{ overscroll: B() }],
        "overscroll-x": [{ "overscroll-x": B() }],
        "overscroll-y": [{ "overscroll-y": B() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: ee() }],
        "inset-x": [{ "inset-x": ee() }],
        "inset-y": [{ "inset-y": ee() }],
        start: [{ "inset-s": ee(), start: ee() }],
        end: [{ "inset-e": ee(), end: ee() }],
        "inset-bs": [{ "inset-bs": ee() }],
        "inset-be": [{ "inset-be": ee() }],
        top: [{ top: ee() }],
        right: [{ right: ee() }],
        bottom: [{ bottom: ee() }],
        left: [{ left: ee() }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: [Ta, "auto", le, ae] }],
        basis: [{ basis: [ja, "full", "auto", v, ...Y()] }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
        flex: [{ flex: [be, ja, "auto", "initial", "none", ae] }],
        grow: [{ grow: ["", be, le, ae] }],
        shrink: [{ shrink: ["", be, le, ae] }],
        order: [{ order: [Ta, "first", "last", "none", le, ae] }],
        "grid-cols": [{ "grid-cols": ye() }],
        "col-start-end": [{ col: pe() }],
        "col-start": [{ "col-start": Ee() }],
        "col-end": [{ "col-end": Ee() }],
        "grid-rows": [{ "grid-rows": ye() }],
        "row-start-end": [{ row: pe() }],
        "row-start": [{ "row-start": Ee() }],
        "row-end": [{ "row-end": Ee() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": Le() }],
        "auto-rows": [{ "auto-rows": Le() }],
        gap: [{ gap: Y() }],
        "gap-x": [{ "gap-x": Y() }],
        "gap-y": [{ "gap-y": Y() }],
        "justify-content": [{ justify: [...Qe(), "normal"] }],
        "justify-items": [{ "justify-items": [...je(), "normal"] }],
        "justify-self": [{ "justify-self": ["auto", ...je()] }],
        "align-content": [{ content: ["normal", ...Qe()] }],
        "align-items": [{ items: [...je(), { baseline: ["", "last"] }] }],
        "align-self": [{ self: ["auto", ...je(), { baseline: ["", "last"] }] }],
        "place-content": [{ "place-content": Qe() }],
        "place-items": [{ "place-items": [...je(), "baseline"] }],
        "place-self": [{ "place-self": ["auto", ...je()] }],
        p: [{ p: Y() }],
        px: [{ px: Y() }],
        py: [{ py: Y() }],
        ps: [{ ps: Y() }],
        pe: [{ pe: Y() }],
        pbs: [{ pbs: Y() }],
        pbe: [{ pbe: Y() }],
        pt: [{ pt: Y() }],
        pr: [{ pr: Y() }],
        pb: [{ pb: Y() }],
        pl: [{ pl: Y() }],
        m: [{ m: M() }],
        mx: [{ mx: M() }],
        my: [{ my: M() }],
        ms: [{ ms: M() }],
        me: [{ me: M() }],
        mbs: [{ mbs: M() }],
        mbe: [{ mbe: M() }],
        mt: [{ mt: M() }],
        mr: [{ mr: M() }],
        mb: [{ mb: M() }],
        ml: [{ ml: M() }],
        "space-x": [{ "space-x": Y() }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": Y() }],
        "space-y-reverse": ["space-y-reverse"],
        size: [{ size: K() }],
        "inline-size": [{ inline: ["auto", ...ie()] }],
        "min-inline-size": [{ "min-inline": ["auto", ...ie()] }],
        "max-inline-size": [{ "max-inline": ["none", ...ie()] }],
        "block-size": [{ block: ["auto", ...ve()] }],
        "min-block-size": [{ "min-block": ["auto", ...ve()] }],
        "max-block-size": [{ "max-block": ["none", ...ve()] }],
        w: [{ w: [v, "screen", ...K()] }],
        "min-w": [{ "min-w": [v, "screen", "none", ...K()] }],
        "max-w": [
          { "max-w": [v, "screen", "none", "prose", { screen: [h] }, ...K()] },
        ],
        h: [{ h: ["screen", "lh", ...K()] }],
        "min-h": [{ "min-h": ["screen", "lh", "none", ...K()] }],
        "max-h": [{ "max-h": ["screen", "lh", ...K()] }],
        "font-size": [{ text: ["base", s, nr, el] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [{ font: [o, P2, K2] }],
        "font-stretch": [
          {
            "font-stretch": [
              "ultra-condensed",
              "extra-condensed",
              "condensed",
              "semi-condensed",
              "normal",
              "semi-expanded",
              "expanded",
              "extra-expanded",
              "ultra-expanded",
              Cc,
              ae,
            ],
          },
        ],
        "font-family": [{ font: [F2, J2, i] }],
        "font-features": [{ "font-features": [ae] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [{ tracking: [c, le, ae] }],
        "line-clamp": [{ "line-clamp": [be, "none", le, qg] }],
        leading: [{ leading: [d, ...Y()] }],
        "list-image": [{ "list-image": ["none", le, ae] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "list-style-type": [{ list: ["disc", "decimal", "none", le, ae] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "placeholder-color": [{ placeholder: W() }],
        "text-color": [{ text: W() }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...me(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: [be, "from-font", "auto", le, el] },
        ],
        "text-decoration-color": [{ decoration: W() }],
        "underline-offset": [{ "underline-offset": [be, "auto", le, ae] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: Y() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              le,
              ae,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", le, ae] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: j() }],
        "bg-repeat": [{ bg: q() }],
        "bg-size": [{ bg: Z() }],
        "bg-image": [
          {
            bg: [
              "none",
              {
                linear: [
                  { to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
                  Ta,
                  le,
                  ae,
                ],
                radial: ["", le, ae],
                conic: [Ta, le, ae],
              },
              I2,
              $2,
            ],
          },
        ],
        "bg-color": [{ bg: W() }],
        "gradient-from-pos": [{ from: I() }],
        "gradient-via-pos": [{ via: I() }],
        "gradient-to-pos": [{ to: I() }],
        "gradient-from": [{ from: W() }],
        "gradient-via": [{ via: W() }],
        "gradient-to": [{ to: W() }],
        rounded: [{ rounded: P() }],
        "rounded-s": [{ "rounded-s": P() }],
        "rounded-e": [{ "rounded-e": P() }],
        "rounded-t": [{ "rounded-t": P() }],
        "rounded-r": [{ "rounded-r": P() }],
        "rounded-b": [{ "rounded-b": P() }],
        "rounded-l": [{ "rounded-l": P() }],
        "rounded-ss": [{ "rounded-ss": P() }],
        "rounded-se": [{ "rounded-se": P() }],
        "rounded-ee": [{ "rounded-ee": P() }],
        "rounded-es": [{ "rounded-es": P() }],
        "rounded-tl": [{ "rounded-tl": P() }],
        "rounded-tr": [{ "rounded-tr": P() }],
        "rounded-br": [{ "rounded-br": P() }],
        "rounded-bl": [{ "rounded-bl": P() }],
        "border-w": [{ border: te() }],
        "border-w-x": [{ "border-x": te() }],
        "border-w-y": [{ "border-y": te() }],
        "border-w-s": [{ "border-s": te() }],
        "border-w-e": [{ "border-e": te() }],
        "border-w-bs": [{ "border-bs": te() }],
        "border-w-be": [{ "border-be": te() }],
        "border-w-t": [{ "border-t": te() }],
        "border-w-r": [{ "border-r": te() }],
        "border-w-b": [{ "border-b": te() }],
        "border-w-l": [{ "border-l": te() }],
        "divide-x": [{ "divide-x": te() }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": te() }],
        "divide-y-reverse": ["divide-y-reverse"],
        "border-style": [{ border: [...me(), "hidden", "none"] }],
        "divide-style": [{ divide: [...me(), "hidden", "none"] }],
        "border-color": [{ border: W() }],
        "border-color-x": [{ "border-x": W() }],
        "border-color-y": [{ "border-y": W() }],
        "border-color-s": [{ "border-s": W() }],
        "border-color-e": [{ "border-e": W() }],
        "border-color-bs": [{ "border-bs": W() }],
        "border-color-be": [{ "border-be": W() }],
        "border-color-t": [{ "border-t": W() }],
        "border-color-r": [{ "border-r": W() }],
        "border-color-b": [{ "border-b": W() }],
        "border-color-l": [{ "border-l": W() }],
        "divide-color": [{ divide: W() }],
        "outline-style": [{ outline: [...me(), "none", "hidden"] }],
        "outline-offset": [{ "outline-offset": [be, le, ae] }],
        "outline-w": [{ outline: ["", be, nr, el] }],
        "outline-color": [{ outline: W() }],
        shadow: [{ shadow: ["", "none", S, Os, Ds] }],
        "shadow-color": [{ shadow: W() }],
        "inset-shadow": [{ "inset-shadow": ["none", p, Os, Ds] }],
        "inset-shadow-color": [{ "inset-shadow": W() }],
        "ring-w": [{ ring: te() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: W() }],
        "ring-offset-w": [{ "ring-offset": [be, el] }],
        "ring-offset-color": [{ "ring-offset": W() }],
        "inset-ring-w": [{ "inset-ring": te() }],
        "inset-ring-color": [{ "inset-ring": W() }],
        "text-shadow": [{ "text-shadow": ["none", N, Os, Ds] }],
        "text-shadow-color": [{ "text-shadow": W() }],
        opacity: [{ opacity: [be, le, ae] }],
        "mix-blend": [
          { "mix-blend": [...de(), "plus-darker", "plus-lighter"] },
        ],
        "bg-blend": [{ "bg-blend": de() }],
        "mask-clip": [
          {
            "mask-clip": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
          "mask-no-clip",
        ],
        "mask-composite": [
          { mask: ["add", "subtract", "intersect", "exclude"] },
        ],
        "mask-image-linear-pos": [{ "mask-linear": [be] }],
        "mask-image-linear-from-pos": [{ "mask-linear-from": ue() }],
        "mask-image-linear-to-pos": [{ "mask-linear-to": ue() }],
        "mask-image-linear-from-color": [{ "mask-linear-from": W() }],
        "mask-image-linear-to-color": [{ "mask-linear-to": W() }],
        "mask-image-t-from-pos": [{ "mask-t-from": ue() }],
        "mask-image-t-to-pos": [{ "mask-t-to": ue() }],
        "mask-image-t-from-color": [{ "mask-t-from": W() }],
        "mask-image-t-to-color": [{ "mask-t-to": W() }],
        "mask-image-r-from-pos": [{ "mask-r-from": ue() }],
        "mask-image-r-to-pos": [{ "mask-r-to": ue() }],
        "mask-image-r-from-color": [{ "mask-r-from": W() }],
        "mask-image-r-to-color": [{ "mask-r-to": W() }],
        "mask-image-b-from-pos": [{ "mask-b-from": ue() }],
        "mask-image-b-to-pos": [{ "mask-b-to": ue() }],
        "mask-image-b-from-color": [{ "mask-b-from": W() }],
        "mask-image-b-to-color": [{ "mask-b-to": W() }],
        "mask-image-l-from-pos": [{ "mask-l-from": ue() }],
        "mask-image-l-to-pos": [{ "mask-l-to": ue() }],
        "mask-image-l-from-color": [{ "mask-l-from": W() }],
        "mask-image-l-to-color": [{ "mask-l-to": W() }],
        "mask-image-x-from-pos": [{ "mask-x-from": ue() }],
        "mask-image-x-to-pos": [{ "mask-x-to": ue() }],
        "mask-image-x-from-color": [{ "mask-x-from": W() }],
        "mask-image-x-to-color": [{ "mask-x-to": W() }],
        "mask-image-y-from-pos": [{ "mask-y-from": ue() }],
        "mask-image-y-to-pos": [{ "mask-y-to": ue() }],
        "mask-image-y-from-color": [{ "mask-y-from": W() }],
        "mask-image-y-to-color": [{ "mask-y-to": W() }],
        "mask-image-radial": [{ "mask-radial": [le, ae] }],
        "mask-image-radial-from-pos": [{ "mask-radial-from": ue() }],
        "mask-image-radial-to-pos": [{ "mask-radial-to": ue() }],
        "mask-image-radial-from-color": [{ "mask-radial-from": W() }],
        "mask-image-radial-to-color": [{ "mask-radial-to": W() }],
        "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
        "mask-image-radial-size": [
          {
            "mask-radial": [
              { closest: ["side", "corner"], farthest: ["side", "corner"] },
            ],
          },
        ],
        "mask-image-radial-pos": [{ "mask-radial-at": F() }],
        "mask-image-conic-pos": [{ "mask-conic": [be] }],
        "mask-image-conic-from-pos": [{ "mask-conic-from": ue() }],
        "mask-image-conic-to-pos": [{ "mask-conic-to": ue() }],
        "mask-image-conic-from-color": [{ "mask-conic-from": W() }],
        "mask-image-conic-to-color": [{ "mask-conic-to": W() }],
        "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
        "mask-origin": [
          {
            "mask-origin": [
              "border",
              "padding",
              "content",
              "fill",
              "stroke",
              "view",
            ],
          },
        ],
        "mask-position": [{ mask: j() }],
        "mask-repeat": [{ mask: q() }],
        "mask-size": [{ mask: Z() }],
        "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
        "mask-image": [{ mask: ["none", le, ae] }],
        filter: [{ filter: ["", "none", le, ae] }],
        blur: [{ blur: Gt() }],
        brightness: [{ brightness: [be, le, ae] }],
        contrast: [{ contrast: [be, le, ae] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", z, Os, Ds] }],
        "drop-shadow-color": [{ "drop-shadow": W() }],
        grayscale: [{ grayscale: ["", be, le, ae] }],
        "hue-rotate": [{ "hue-rotate": [be, le, ae] }],
        invert: [{ invert: ["", be, le, ae] }],
        saturate: [{ saturate: [be, le, ae] }],
        sepia: [{ sepia: ["", be, le, ae] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none", le, ae] }],
        "backdrop-blur": [{ "backdrop-blur": Gt() }],
        "backdrop-brightness": [{ "backdrop-brightness": [be, le, ae] }],
        "backdrop-contrast": [{ "backdrop-contrast": [be, le, ae] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": ["", be, le, ae] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [be, le, ae] }],
        "backdrop-invert": [{ "backdrop-invert": ["", be, le, ae] }],
        "backdrop-opacity": [{ "backdrop-opacity": [be, le, ae] }],
        "backdrop-saturate": [{ "backdrop-saturate": [be, le, ae] }],
        "backdrop-sepia": [{ "backdrop-sepia": ["", be, le, ae] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": Y() }],
        "border-spacing-x": [{ "border-spacing-x": Y() }],
        "border-spacing-y": [{ "border-spacing-y": Y() }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "",
              "all",
              "colors",
              "opacity",
              "shadow",
              "transform",
              "none",
              le,
              ae,
            ],
          },
        ],
        "transition-behavior": [{ transition: ["normal", "discrete"] }],
        duration: [{ duration: [be, "initial", le, ae] }],
        ease: [{ ease: ["linear", "initial", C, le, ae] }],
        delay: [{ delay: [be, le, ae] }],
        animate: [{ animate: ["none", X, le, ae] }],
        backface: [{ backface: ["hidden", "visible"] }],
        perspective: [{ perspective: [E, le, ae] }],
        "perspective-origin": [{ "perspective-origin": H() }],
        rotate: [{ rotate: Ct() }],
        "rotate-x": [{ "rotate-x": Ct() }],
        "rotate-y": [{ "rotate-y": Ct() }],
        "rotate-z": [{ "rotate-z": Ct() }],
        scale: [{ scale: wt() }],
        "scale-x": [{ "scale-x": wt() }],
        "scale-y": [{ "scale-y": wt() }],
        "scale-z": [{ "scale-z": wt() }],
        "scale-3d": ["scale-3d"],
        skew: [{ skew: In() }],
        "skew-x": [{ "skew-x": In() }],
        "skew-y": [{ "skew-y": In() }],
        transform: [{ transform: [le, ae, "", "none", "gpu", "cpu"] }],
        "transform-origin": [{ origin: H() }],
        "transform-style": [{ transform: ["3d", "flat"] }],
        translate: [{ translate: bt() }],
        "translate-x": [{ "translate-x": bt() }],
        "translate-y": [{ "translate-y": bt() }],
        "translate-z": [{ "translate-z": bt() }],
        "translate-none": ["translate-none"],
        accent: [{ accent: W() }],
        appearance: [{ appearance: ["none", "auto"] }],
        "caret-color": [{ caret: W() }],
        "color-scheme": [
          {
            scheme: [
              "normal",
              "dark",
              "light",
              "light-dark",
              "only-dark",
              "only-light",
            ],
          },
        ],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              le,
              ae,
            ],
          },
        ],
        "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
        "pointer-events": [{ "pointer-events": ["auto", "none"] }],
        resize: [{ resize: ["none", "", "y", "x"] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": Y() }],
        "scroll-mx": [{ "scroll-mx": Y() }],
        "scroll-my": [{ "scroll-my": Y() }],
        "scroll-ms": [{ "scroll-ms": Y() }],
        "scroll-me": [{ "scroll-me": Y() }],
        "scroll-mbs": [{ "scroll-mbs": Y() }],
        "scroll-mbe": [{ "scroll-mbe": Y() }],
        "scroll-mt": [{ "scroll-mt": Y() }],
        "scroll-mr": [{ "scroll-mr": Y() }],
        "scroll-mb": [{ "scroll-mb": Y() }],
        "scroll-ml": [{ "scroll-ml": Y() }],
        "scroll-p": [{ "scroll-p": Y() }],
        "scroll-px": [{ "scroll-px": Y() }],
        "scroll-py": [{ "scroll-py": Y() }],
        "scroll-ps": [{ "scroll-ps": Y() }],
        "scroll-pe": [{ "scroll-pe": Y() }],
        "scroll-pbs": [{ "scroll-pbs": Y() }],
        "scroll-pbe": [{ "scroll-pbe": Y() }],
        "scroll-pt": [{ "scroll-pt": Y() }],
        "scroll-pr": [{ "scroll-pr": Y() }],
        "scroll-pb": [{ "scroll-pb": Y() }],
        "scroll-pl": [{ "scroll-pl": Y() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          {
            "will-change": ["auto", "scroll", "contents", "transform", le, ae],
          },
        ],
        fill: [{ fill: ["none", ...W()] }],
        "stroke-w": [{ stroke: [be, nr, el, qg] }],
        stroke: [{ stroke: ["none", ...W()] }],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "inset-bs",
          "inset-be",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-x",
          "border-w-y",
          "border-w-s",
          "border-w-e",
          "border-w-bs",
          "border-w-be",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-x",
          "border-color-y",
          "border-color-s",
          "border-color-e",
          "border-color-bs",
          "border-color-be",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": [
          "translate",
          "translate-x",
          "translate-y",
          "translate-z",
        ],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mbs",
          "scroll-mbe",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pbs",
          "scroll-pbe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
      orderSensitiveModifiers: [
        "*",
        "**",
        "after",
        "backdrop",
        "before",
        "details-content",
        "file",
        "first-letter",
        "first-line",
        "marker",
        "placeholder",
        "selection",
      ],
    };
  },
  nw = O2(tw);
function _e(...a) {
  return nw(zp(a));
}
const aw = Zc(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/90",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
function $t({ className: a, variant: i = "default", asChild: s = !1, ...o }) {
  const c = s ? Dp : "span";
  return f.jsx(c, {
    "data-slot": "badge",
    "data-variant": i,
    className: _e(aw({ variant: i }), a),
    ...o,
  });
}
const Qg = (a) => {
    let i;
    const s = new Set(),
      o = (g, S) => {
        const p = typeof g == "function" ? g(i) : g;
        if (!Object.is(p, i)) {
          const N = i;
          ((i =
            (S ?? (typeof p != "object" || p === null))
              ? p
              : Object.assign({}, i, p)),
            s.forEach((z) => z(i, N)));
        }
      },
      c = () => i,
      v = {
        setState: o,
        getState: c,
        getInitialState: () => y,
        subscribe: (g) => (s.add(g), () => s.delete(g)),
      },
      y = (i = a(o, c, v));
    return v;
  },
  lw = (a) => (a ? Qg(a) : Qg),
  iw = (a) => a;
function rw(a, i = iw) {
  const s = $.useSyncExternalStore(
    a.subscribe,
    $.useCallback(() => i(a.getState()), [a, i]),
    $.useCallback(() => i(a.getInitialState()), [a, i]),
  );
  return ($.useDebugValue(s), s);
}
const Zg = (a) => {
    const i = lw(a),
      s = (o) => rw(i, o);
    return (Object.assign(s, i), s);
  },
  ef = (a) => (a ? Zg(a) : Zg),
  Kg = 500;
function Fl(a, i) {
  return a.some((s) => s.email_id === i);
}
function tl(a) {
  return a.length > Kg ? a.slice(a.length - Kg) : a;
}
const vt = ef((a, i) => ({
    spam: [],
    ads: [],
    urgent: [],
    other: [],
    escalations: [],
    unsubscribes: [],
    sent: [],
    addEmail: (s) => {
      if (!("category" in s)) {
        a((o) =>
          Fl(o.unsubscribes, s.email_id)
            ? o
            : { unsubscribes: tl([...o.unsubscribes, s]) },
        );
        return;
      }
      switch (s.category) {
        case "SPAM":
          a((o) => (Fl(o.spam, s.email_id) ? o : { spam: tl([...o.spam, s]) }));
          break;
        case "AD":
          a((o) => (Fl(o.ads, s.email_id) ? o : { ads: tl([...o.ads, s]) }));
          break;
        case "URGENT":
          a((o) =>
            Fl(o.urgent, s.email_id) ? o : { urgent: tl([...o.urgent, s]) },
          );
          break;
        case "OTHER":
          a((o) =>
            Fl(o.other, s.email_id) ? o : { other: tl([...o.other, s]) },
          );
          break;
        case "ESCALATION":
          a((o) =>
            Fl(o.escalations, s.email_id)
              ? o
              : { escalations: tl([...o.escalations, s]) },
          );
          break;
      }
    },
    removeEmail: (s, o) => {
      a((c) => {
        switch (s) {
          case "spam":
            return { spam: c.spam.filter((d) => d.email_id !== o) };
          case "ads":
            return { ads: c.ads.filter((d) => d.email_id !== o) };
          case "urgent":
            return { urgent: c.urgent.filter((d) => d.email_id !== o) };
          case "other":
            return { other: c.other.filter((d) => d.email_id !== o) };
          case "escalations":
            return {
              escalations: c.escalations.filter((d) => d.email_id !== o),
            };
          case "unsubscribes":
            return {
              unsubscribes: c.unsubscribes.filter((d) => d.email_id !== o),
            };
          case "sent":
            return { sent: c.sent.filter((d) => d.email_id !== o) };
          default:
            return {};
        }
      });
    },
    removeEmailById: (s) => {
      const o = i();
      (console.log("removeEmailById called with:", s, "current state keys:", {
        spam: o.spam.map((c) => c.email_id),
        ads: o.ads.map((c) => c.email_id),
        urgent: o.urgent.map((c) => c.email_id),
        other: o.other.map((c) => c.email_id),
        escalations: o.escalations.map((c) => c.email_id),
        unsubscribes: o.unsubscribes.map((c) => c.email_id),
        sent: o.sent.map((c) => c.email_id),
      }),
        a((c) => ({
          spam: c.spam.filter((d) => d.email_id !== s),
          ads: c.ads.filter((d) => d.email_id !== s),
          urgent: c.urgent.filter((d) => d.email_id !== s),
          other: c.other.filter((d) => d.email_id !== s),
          escalations: c.escalations.filter((d) => d.email_id !== s),
          unsubscribes: c.unsubscribes.filter((d) => d.email_id !== s),
          sent: c.sent.filter((d) => d.email_id !== s),
        })));
    },
    updateEmail: (s, o, c) => {
      a((d) => {
        switch (s) {
          case "spam":
            return {
              spam: d.spam.map((h) => (h.email_id === o ? { ...h, ...c } : h)),
            };
          case "ads":
            return {
              ads: d.ads.map((h) => (h.email_id === o ? { ...h, ...c } : h)),
            };
          case "urgent":
            return {
              urgent: d.urgent.map((h) =>
                h.email_id === o ? { ...h, ...c } : h,
              ),
            };
          case "other":
            return {
              other: d.other.map((h) =>
                h.email_id === o ? { ...h, ...c } : h,
              ),
            };
          case "escalations":
            return {
              escalations: d.escalations.map((h) =>
                h.email_id === o ? { ...h, ...c } : h,
              ),
            };
          case "unsubscribes":
            return {
              unsubscribes: d.unsubscribes.map((h) =>
                h.email_id === o ? { ...h, ...c } : h,
              ),
            };
          case "sent":
            return {
              sent: d.sent.map((h) => (h.email_id === o ? { ...h, ...c } : h)),
            };
          default:
            return {};
        }
      });
    },
    clearCategory: (s) => {
      a(() => {
        switch (s) {
          case "spam":
            return { spam: [] };
          case "ads":
            return { ads: [] };
          case "urgent":
            return { urgent: [] };
          case "other":
            return { other: [] };
          case "escalations":
            return { escalations: [] };
          case "unsubscribes":
            return { unsubscribes: [] };
          case "sent":
            return { sent: [] };
          default:
            return {};
        }
      });
    },
    getActionCount: () => {
      const s = i();
      return (
        s.spam.length +
        s.ads.length +
        s.urgent.length +
        s.other.length +
        s.escalations.length +
        s.unsubscribes.filter((o) => o.status === "nicht erfolgreich").length
      );
    },
    hydrateFromServer: (s) => {
      a(() => ({
        spam: s.spam ?? [],
        ads: s.ad ?? [],
        urgent: s.urgent ?? [],
        other: s.other ?? [],
        escalations: s.escalation ?? [],
        unsubscribes: s.unsubscribe ?? [],
      }));
    },
    mergeFromServer: (s) => {
      let o = 0;
      function c(d, h) {
        const v = new Set(d.map((g) => g.email_id)),
          y = h.filter(
            (g) => typeof g.email_id == "string" && !v.has(g.email_id),
          );
        return ((o += y.length), y.length > 0 ? tl([...d, ...y]) : d);
      }
      return (
        a((d) => ({
          spam: c(d.spam, s.spam ?? []),
          ads: c(d.ads, s.ad ?? []),
          urgent: c(d.urgent, s.urgent ?? []),
          other: c(d.other, s.other ?? []),
          escalations: c(d.escalations, s.escalation ?? []),
          unsubscribes: c(d.unsubscribes, s.unsubscribe ?? []),
        })),
        o > 0
      );
    },
    setSentEmails: (s) => {
      a({ sent: s });
    },
  })),
  ei = ef((a) => ({
    user: null,
    isVerified: !1,
    isLoading: !0,
    error: null,
    checkAuth: async () => {
      a({ isLoading: !0, error: null });
      try {
        const i = await fetch("/api/auth/me");
        if (i.ok) {
          const s = await i.json();
          a({ user: s, isVerified: !0, isLoading: !1, error: null });
        } else a({ user: null, isVerified: !1, isLoading: !1, error: null });
      } catch {
        a({
          user: null,
          isVerified: !1,
          isLoading: !1,
          error: "network-error",
        });
      }
    },
    logout: async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {}
      a({ user: null, isVerified: !1, isLoading: !1, error: null });
    },
    setUser: (i) => a({ user: i, isVerified: !0, isLoading: !1, error: null }),
    setLoading: (i) => a({ isLoading: i }),
    setError: (i) => a({ error: i, isLoading: !1, isVerified: !1 }),
  }));
function sw() {
  const a = vt(
    (i) =>
      i.spam.length +
      i.ads.length +
      i.urgent.length +
      i.other.length +
      i.escalations.length +
      i.unsubscribes.filter((s) => s.status === "nicht erfolgreich").length,
  );
  return a === 0
    ? null
    : f.jsx($t, {
        variant: "default",
        className: "text-sm px-2.5 py-0.5",
        children: a,
      });
}
function ow({ children: a, isSyncing: i }) {
  const s = Zs();
  async function o() {
    (await ei.getState().logout(), s("/login", { replace: !0 }));
  }
  return f.jsx("header", {
    className: "border-b border-border bg-background",
    children: f.jsxs("div", {
      className:
        "container mx-auto flex items-center justify-between px-4 py-4 md:px-6",
      children: [
        f.jsxs("div", {
          className: "flex items-center gap-3",
          children: [
            f.jsxs("div", {
              children: [
                f.jsx("h1", {
                  className:
                    "text-lg font-bold lowercase leading-tight text-foreground",
                  children: "siteware",
                }),
                f.jsx("p", {
                  className: "text-xs text-muted-foreground",
                  children: "E-Mail Automation",
                }),
              ],
            }),
            i &&
              f.jsxs("div", {
                className:
                  "flex items-center gap-1.5 text-xs text-muted-foreground",
                children: [
                  f.jsx("span", {
                    className: "size-1.5 animate-pulse rounded-full bg-current",
                  }),
                  "Postfach wird synchronisiert…",
                ],
              }),
          ],
        }),
        a,
        f.jsxs("div", {
          className: "flex items-center gap-3",
          children: [
            f.jsx("span", {
              className: "text-sm text-muted-foreground",
              children: "Offene Aktionen",
            }),
            f.jsx(sw, {}),
            f.jsx(Il, {
              to: "/settings",
              className:
                "cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
              title: "Einstellungen",
              children: f.jsx(M1, { className: "size-5" }),
            }),
            f.jsx("button", {
              type: "button",
              onClick: () => {
                o();
              },
              className:
                "cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground",
              title: "Abmelden",
              children: f.jsx(S1, { className: "size-5" }),
            }),
          ],
        }),
      ],
    }),
  });
}
function uw({ className: a, orientation: i = "horizontal", ...s }) {
  return f.jsx(c2, {
    "data-slot": "tabs",
    "data-orientation": i,
    orientation: i,
    className: _e(
      "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
      a,
    ),
    ...s,
  });
}
const cw = Zc(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: { default: "bg-muted", line: "gap-1 bg-transparent" },
    },
    defaultVariants: { variant: "default" },
  },
);
function fw({ className: a, variant: i = "default", ...s }) {
  return f.jsx(f2, {
    "data-slot": "tabs-list",
    "data-variant": i,
    className: _e(cw({ variant: i }), a),
    ...s,
  });
}
function dw({ className: a, ...i }) {
  return f.jsx(d2, {
    "data-slot": "tabs-trigger",
    className: _e(
      "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
      "data-[state=active]:bg-background data-[state=active]:text-foreground",
      "after:absolute after:bg-primary after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
      a,
    ),
    ...i,
  });
}
function mw({ className: a, ...i }) {
  return f.jsx(m2, {
    "data-slot": "tabs-content",
    className: _e("flex-1 outline-none", a),
    ...i,
  });
}
const Wl = ef((a) => ({
  activeTab: "urgent",
  selectedEmailId: null,
  draftEditorContent: "",
  setActiveTab: (i) =>
    a({ activeTab: i, selectedEmailId: null, draftEditorContent: "" }),
  setSelectedEmailId: (i) => a({ selectedEmailId: i }),
  setDraftEditorContent: (i) => a({ draftEditorContent: i }),
}));
function Kn({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "card",
    className: _e(
      "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
      a,
    ),
    ...i,
  });
}
function Jn({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "card-header",
    className: _e(
      "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
      a,
    ),
    ...i,
  });
}
function $n({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "card-title",
    className: _e("leading-none font-semibold", a),
    ...i,
  });
}
function al({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "card-description",
    className: _e("text-sm text-muted-foreground", a),
    ...i,
  });
}
function Qn({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "card-content",
    className: _e("px-6", a),
    ...i,
  });
}
function hw({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "card-footer",
    className: _e("flex items-center px-6 [.border-t]:pt-6", a),
    ...i,
  });
}
const gw = Zc(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-full px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-full px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-full [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
function qe({
  className: a,
  variant: i = "default",
  size: s = "default",
  asChild: o = !1,
  ...c
}) {
  const d = o ? Dp : "button";
  return f.jsx(d, {
    "data-slot": "button",
    "data-variant": i,
    "data-size": s,
    className: _e(gw({ variant: i, size: s, className: a })),
    ...c,
  });
}
function tf({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "table-container",
    className: "relative w-full overflow-x-auto",
    children: f.jsx("table", {
      "data-slot": "table",
      className: _e("w-full caption-bottom text-sm", a),
      ...i,
    }),
  });
}
function nf({ className: a, ...i }) {
  return f.jsx("thead", {
    "data-slot": "table-header",
    className: _e("[&_tr]:border-b", a),
    ...i,
  });
}
function af({ className: a, ...i }) {
  return f.jsx("tbody", {
    "data-slot": "table-body",
    className: _e("[&_tr:last-child]:border-0", a),
    ...i,
  });
}
function Ra({ className: a, ...i }) {
  return f.jsx("tr", {
    "data-slot": "table-row",
    className: _e(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      a,
    ),
    ...i,
  });
}
function ut({ className: a, ...i }) {
  return f.jsx("th", {
    "data-slot": "table-head",
    className: _e(
      "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      a,
    ),
    ...i,
  });
}
function nt({ className: a, ...i }) {
  return f.jsx("td", {
    "data-slot": "table-cell",
    className: _e(
      "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      a,
    ),
    ...i,
  });
}
function pw(a) {
  const i = new Date(a);
  return isNaN(i.getTime())
    ? "—"
    : new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(i);
}
function vw({ confidence: a, lowConfidence: i }) {
  const s = Math.round(a * 100);
  return i
    ? f.jsxs("span", {
        className: "inline-flex items-center gap-1",
        title: "Niedrige Konfidenz",
        "aria-label": "Niedrige Konfidenz",
        children: [
          f.jsx(Cp, {
            className: "size-4 text-amber-500",
            "aria-hidden": "true",
          }),
          f.jsxs($t, {
            variant: "outline",
            className: "border-amber-300 bg-amber-50 text-amber-700",
            children: [s, "%"],
          }),
        ],
      })
    : f.jsxs($t, { variant: "secondary", children: [s, "%"] });
}
function bw({ email: a, columnCount: i }) {
  return f.jsx(Ra, {
    children: f.jsx(nt, {
      colSpan: i,
      className: "bg-muted/30 px-6 py-4",
      children: f.jsxs("div", {
        className: "flex flex-col gap-3",
        children: [
          f.jsxs("div", {
            children: [
              f.jsx("span", {
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                children: "Vorschau",
              }),
              f.jsx("p", {
                className: "mt-1 text-sm text-foreground",
                children: a.preview,
              }),
            ],
          }),
          f.jsxs("div", {
            children: [
              f.jsx("span", {
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                children: "Klassifizierungsgrund",
              }),
              f.jsx("p", {
                className: "mt-1 text-sm text-foreground",
                children: a.reasoning,
              }),
            ],
          }),
          f.jsxs("div", {
            className: "flex items-center gap-4 text-xs text-muted-foreground",
            children: [
              f.jsxs("span", { children: ["Domain: ", a.sender_domain] }),
              f.jsxs("span", { children: ["E-Mail: ", a.sender_email] }),
            ],
          }),
        ],
      }),
    }),
  });
}
function yw({ message: a }) {
  return f.jsxs("div", {
    className: "flex flex-col items-center justify-center py-16 text-center",
    children: [
      f.jsx(Tp, { className: "size-12 text-muted-foreground/40" }),
      f.jsx("p", {
        className: "mt-4 text-sm text-muted-foreground",
        children: a,
      }),
    ],
  });
}
function Xv({
  emails: a,
  selectedIds: i,
  expandedId: s,
  onToggleSelect: o,
  onToggleSelectAll: c,
  onToggleExpand: d,
  renderRowActions: h,
  emptyMessage: v,
}) {
  const y = a.length > 0 && i.size === a.length,
    g = i.size > 0 && i.size < a.length,
    S = b.useCallback(
      (A, E) => {
        (A.stopPropagation(), o(E));
      },
      [o],
    ),
    p = b.useCallback(
      (A) => {
        (A.stopPropagation(), c());
      },
      [c],
    ),
    N = h ? 7 : 6,
    z = b.useMemo(
      () =>
        [...a].sort(
          (A, E) => new Date(E.date).getTime() - new Date(A.date).getTime(),
        ),
      [a],
    );
  return a.length === 0
    ? f.jsx(yw, { message: v })
    : f.jsxs(tf, {
        children: [
          f.jsx(nf, {
            children: f.jsxs(Ra, {
              children: [
                f.jsx(ut, {
                  className: "w-10",
                  children: f.jsx("input", {
                    type: "checkbox",
                    checked: y,
                    ref: (A) => {
                      A && (A.indeterminate = g);
                    },
                    onClick: p,
                    onChange: () => {},
                    className:
                      "size-4 cursor-pointer rounded border-border accent-primary",
                    "aria-label": y ? "Alle abwählen" : "Alle auswählen",
                  }),
                }),
                f.jsx(ut, { className: "w-6" }),
                f.jsx(ut, { children: "Absender" }),
                f.jsx(ut, { children: "Betreff" }),
                f.jsx(ut, { children: "Datum" }),
                f.jsx(ut, { children: "Konfidenz" }),
                h
                  ? f.jsx(ut, { className: "text-right", children: "Aktionen" })
                  : null,
              ],
            }),
          }),
          f.jsx(af, {
            children: z.map((A) => {
              const E = i.has(A.email_id),
                _ = s === A.email_id;
              return f.jsx(
                xw,
                {
                  email: A,
                  isSelected: E,
                  isExpanded: _,
                  columnCount: N,
                  onCheckboxClick: S,
                  onRowClick: d,
                  renderRowActions: h,
                },
                A.email_id,
              );
            }),
          }),
        ],
      });
}
function xw({
  email: a,
  isSelected: i,
  isExpanded: s,
  columnCount: o,
  onCheckboxClick: c,
  onRowClick: d,
  renderRowActions: h,
}) {
  const v = b.useCallback(() => {
      d(a.email_id);
    }, [d, a.email_id]),
    y = b.useCallback(
      (S) => {
        c(S, a.email_id);
      },
      [c, a.email_id],
    ),
    g = b.useCallback((S) => {
      S.stopPropagation();
    }, []);
  return f.jsxs(f.Fragment, {
    children: [
      f.jsxs(Ra, {
        className: _e("cursor-pointer", i && "bg-muted/50"),
        "data-state": i ? "selected" : void 0,
        onClick: v,
        children: [
          f.jsx(nt, {
            children: f.jsx("input", {
              type: "checkbox",
              checked: i,
              onClick: y,
              onChange: () => {},
              className:
                "size-4 cursor-pointer rounded border-border accent-primary",
              "aria-label": `${a.sender_name} auswählen`,
            }),
          }),
          f.jsx(nt, {
            className: "px-0",
            children: s
              ? f.jsx(Np, { className: "size-4 text-muted-foreground" })
              : f.jsx(_p, { className: "size-4 text-muted-foreground" }),
          }),
          f.jsx(nt, {
            children: f.jsxs("div", {
              className: "flex flex-col",
              children: [
                f.jsx("span", {
                  className: "font-medium",
                  children: a.sender_name,
                }),
                f.jsx("span", {
                  className: "text-xs text-muted-foreground",
                  children: a.sender_domain,
                }),
              ],
            }),
          }),
          f.jsx(nt, { className: "max-w-xs truncate", children: a.subject }),
          f.jsx(nt, {
            className: "text-muted-foreground",
            children: pw(a.date),
          }),
          f.jsx(nt, {
            children: f.jsx(vw, {
              confidence: a.confidence,
              lowConfidence: a.low_confidence,
            }),
          }),
          h
            ? f.jsx(nt, { className: "text-right", onClick: g, children: h(a) })
            : null,
        ],
      }),
      s ? f.jsx(bw, { email: a, columnCount: o }) : null,
    ],
  });
}
class Qv extends Error {
  status;
  endpoint;
  constructor(i, s, o) {
    (super(i),
      (this.name = "WebhookError"),
      (this.status = s),
      (this.endpoint = o));
  }
}
async function lf(a, i) {
  const s = `/api/webhooks/${a}`,
    o = await fetch(s, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
      signal: AbortSignal.timeout(3e4),
    });
  if (!o.ok)
    throw new Qv(`Webhook fehlgeschlagen (HTTP ${o.status})`, o.status, a);
}
async function Zv(a) {
  const i = "/api/email/send",
    s = await fetch(i, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: a.sender_email,
        subject: a.subject,
        body_html: a.draft_html,
        body_plain: a.draft_plain,
        email_id: a.email_id,
      }),
      signal: AbortSignal.timeout(3e4),
    });
  if (!s.ok) {
    const o = await s.json().catch(() => ({})),
      c = typeof o.error == "string" ? o.error : `HTTP ${s.status}`;
    throw new Qv(`E-Mail-Versand fehlgeschlagen: ${c}`, s.status, i);
  }
}
async function Kv(a) {
  await lf("reject", a);
}
async function Jv(a) {
  await lf("retriage", a);
}
async function $v(a) {
  await lf("unsubscribe", a);
}
async function Fv() {
  const a = await fetch("/api/emails", { signal: AbortSignal.timeout(1e4) });
  if (!a.ok) return;
  const i = await a.json();
  i.success && vt.getState().hydrateFromServer(i.data);
}
class Wv extends Error {
  status;
  endpoint;
  constructor(i, s, o) {
    (super(i),
      (this.name = "ServerApiError"),
      (this.status = s),
      (this.endpoint = o));
  }
}
async function Iv(a) {
  const i = `/api/email/${encodeURIComponent(a)}`,
    s = await fetch(i, { method: "DELETE", signal: AbortSignal.timeout(1e4) });
  if (!s.ok)
    throw new Wv(`Löschen fehlgeschlagen (HTTP ${s.status})`, s.status, i);
}
async function Vs(a, i) {
  const s = `/api/email/${encodeURIComponent(a)}`,
    o = await fetch(s, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(i),
      signal: AbortSignal.timeout(1e4),
    });
  if (!o.ok)
    throw new Wv(
      `Status-Update fehlgeschlagen (HTTP ${o.status})`,
      o.status,
      s,
    );
}
function at(a) {
  try {
    fetch("/api/email/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(a),
      signal: AbortSignal.timeout(5e3),
    }).catch(() => {});
  } catch {}
}
function Sw() {
  const a = vt((C) => C.spam),
    i = vt((C) => C.removeEmail),
    [s, o] = b.useState(new Set()),
    [c, d] = b.useState(null),
    [h, v] = b.useState(!1),
    y = b.useCallback((C) => {
      o((X) => {
        const L = new Set(X);
        return (L.has(C) ? L.delete(C) : L.add(C), L);
      });
    }, []),
    g = b.useCallback(() => {
      o((C) =>
        C.size === a.length ? new Set() : new Set(a.map((X) => X.email_id)),
      );
    }, [a]),
    S = b.useCallback((C) => {
      d((X) => (X === C ? null : C));
    }, []),
    [p, N] = b.useState(!1),
    z = b.useCallback(async () => {
      if (s.size !== 0) {
        N(!0);
        try {
          const C = [...s],
            X = await Promise.allSettled(C.map((H) => Iv(H))),
            L = [];
          X.forEach((H, J) => {
            const B = C[J];
            if (H.status === "fulfilled")
              (L.push(B),
                at({
                  action: "email_deleted",
                  email_id: B,
                  category: "SPAM",
                  result: "success",
                }));
            else {
              const Y =
                H.reason instanceof Error
                  ? H.reason.message
                  : "Unbekannter Fehler";
              at({
                action: "email_deleted",
                email_id: B,
                category: "SPAM",
                result: "failure",
                error: Y,
              });
            }
          });
          const F = C.length - L.length;
          (L.length > 0 &&
            Fe.success(`${L.length} E-Mail${L.length > 1 ? "s" : ""} gelöscht`),
            F > 0 &&
              Fe.error(
                `${F} E-Mail${F > 1 ? "s" : ""} konnten nicht gelöscht werden`,
              ),
            o((H) => {
              const J = new Set(H);
              for (const B of L) J.delete(B);
              return J;
            }),
            d((H) => (H && L.includes(H) ? null : H)));
        } finally {
          N(!1);
        }
      }
    }, [s]),
    A = b.useCallback(async () => {
      const C = a.filter((X) => s.has(X.email_id));
      if (C.length !== 0) {
        v(!0);
        try {
          const X = await Promise.allSettled(
              C.map((H) =>
                Jv({
                  email_id: H.email_id,
                  sender_email: H.sender_email,
                  subject: H.subject,
                  original_category: H.category,
                }),
              ),
            ),
            L = [];
          X.forEach((H, J) => {
            const B = C[J].email_id;
            if (H.status === "fulfilled")
              (L.push(B),
                at({
                  action: "email_retriaged",
                  email_id: B,
                  category: "SPAM",
                  result: "success",
                }));
            else {
              const Y =
                H.reason instanceof Error ? H.reason.message : "Unknown error";
              at({
                action: "email_retriaged",
                email_id: B,
                category: "SPAM",
                result: "failure",
                error: Y,
              });
            }
          });
          for (const H of L) i("spam", H);
          L.length > 0 && (await Fv());
          const F = C.length - L.length;
          (L.length > 0 &&
            Fe.success(
              `${L.length} E-Mail${L.length > 1 ? "s" : ""} zurück in den Posteingang`,
            ),
            F > 0 &&
              Fe.error(
                `${F} E-Mail${F > 1 ? "s" : ""} konnten nicht verschoben werden`,
              ),
            o((H) => {
              const J = new Set(H);
              for (const B of L) J.delete(B);
              return J;
            }),
            d((H) => (H && L.includes(H) ? null : H)));
        } finally {
          v(!1);
        }
      }
    }, [a, s, i]),
    E = s.size,
    _ = E > 0;
  return f.jsxs(Kn, {
    children: [
      f.jsx(Jn, {
        children: f.jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            f.jsxs("div", {
              children: [
                f.jsx($n, { children: "Spam" }),
                f.jsxs(al, {
                  children: [
                    a.length,
                    " ",
                    a.length === 1 ? "E-Mail" : "E-Mails",
                    " ",
                    "erkannt",
                  ],
                }),
              ],
            }),
            _
              ? f.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    f.jsxs("span", {
                      className: "text-sm text-muted-foreground",
                      "aria-live": "polite",
                      "aria-atomic": "true",
                      children: [E, " ausgewählt"],
                    }),
                    f.jsxs(qe, {
                      variant: "destructive",
                      size: "sm",
                      disabled: p,
                      onClick: z,
                      children: [
                        p
                          ? f.jsx(gt, { className: "animate-spin" })
                          : f.jsx(Qc, {}),
                        "Ausgewählte löschen",
                      ],
                    }),
                    f.jsxs(qe, {
                      variant: "outline",
                      size: "sm",
                      disabled: h,
                      onClick: A,
                      children: [
                        h
                          ? f.jsx(gt, { className: "animate-spin" })
                          : f.jsx(wp, {}),
                        "In Posteingang",
                      ],
                    }),
                  ],
                })
              : null,
          ],
        }),
      }),
      f.jsx(Qn, {
        children: f.jsx(Xv, {
          emails: a,
          selectedIds: s,
          expandedId: c,
          onToggleSelect: y,
          onToggleSelectAll: g,
          onToggleExpand: S,
          emptyMessage: "Kein Spam erkannt",
        }),
      }),
    ],
  });
}
function Ew({ available: a }) {
  return a
    ? f.jsxs("span", {
        className: "inline-flex items-center gap-1 text-xs text-emerald-600",
        children: [f.jsx(jp, { className: "size-3.5" }), "Abmeldung verfügbar"],
      })
    : f.jsxs("span", {
        className:
          "inline-flex items-center gap-1 text-xs text-muted-foreground",
        children: [f.jsx(g1, { className: "size-3.5" }), "Keine Abmeldung"],
      });
}
function ww() {
  const a = vt((H) => H.ads),
    i = vt((H) => H.removeEmail),
    [s, o] = b.useState(new Set()),
    [c, d] = b.useState(null),
    [h, v] = b.useState(!1),
    [y, g] = b.useState(null),
    S = b.useCallback((H) => {
      o((J) => {
        const B = new Set(J);
        return (B.has(H) ? B.delete(H) : B.add(H), B);
      });
    }, []),
    p = b.useCallback(() => {
      o((H) =>
        H.size === a.length ? new Set() : new Set(a.map((J) => J.email_id)),
      );
    }, [a]),
    N = b.useCallback((H) => {
      d((J) => (J === H ? null : H));
    }, []),
    [z, A] = b.useState(!1),
    E = b.useCallback(async () => {
      if (s.size !== 0) {
        A(!0);
        try {
          const H = [...s],
            J = await Promise.allSettled(H.map((ee) => Iv(ee))),
            B = [];
          J.forEach((ee, ye) => {
            const pe = H[ye];
            if (ee.status === "fulfilled")
              (B.push(pe),
                at({
                  action: "email_deleted",
                  email_id: pe,
                  category: "AD",
                  result: "success",
                }));
            else {
              const Ee =
                ee.reason instanceof Error
                  ? ee.reason.message
                  : "Unbekannter Fehler";
              at({
                action: "email_deleted",
                email_id: pe,
                category: "AD",
                result: "failure",
                error: Ee,
              });
            }
          });
          const Y = H.length - B.length;
          (B.length > 0 &&
            Fe.success(`${B.length} E-Mail${B.length > 1 ? "s" : ""} gelöscht`),
            Y > 0 &&
              Fe.error(
                `${Y} E-Mail${Y > 1 ? "s" : ""} konnten nicht gelöscht werden`,
              ),
            o((ee) => {
              const ye = new Set(ee);
              for (const pe of B) ye.delete(pe);
              return ye;
            }),
            d((ee) => (ee && B.includes(ee) ? null : ee)));
        } finally {
          A(!1);
        }
      }
    }, [s]),
    _ = b.useCallback(async () => {
      const H = a.filter((J) => s.has(J.email_id));
      if (H.length !== 0) {
        v(!0);
        try {
          const J = await Promise.allSettled(
              H.map((ee) =>
                Jv({
                  email_id: ee.email_id,
                  sender_email: ee.sender_email,
                  subject: ee.subject,
                  original_category: ee.category,
                }),
              ),
            ),
            B = [];
          J.forEach((ee, ye) => {
            const pe = H[ye].email_id;
            if (ee.status === "fulfilled")
              (B.push(pe),
                at({
                  action: "email_retriaged",
                  email_id: pe,
                  category: "AD",
                  result: "success",
                }));
            else {
              const Ee =
                ee.reason instanceof Error
                  ? ee.reason.message
                  : "Unknown error";
              at({
                action: "email_retriaged",
                email_id: pe,
                category: "AD",
                result: "failure",
                error: Ee,
              });
            }
          });
          for (const ee of B) i("ads", ee);
          B.length > 0 && (await Fv());
          const Y = H.length - B.length;
          (B.length > 0 &&
            Fe.success(
              `${B.length} E-Mail${B.length > 1 ? "s" : ""} zurück in den Posteingang`,
            ),
            Y > 0 &&
              Fe.error(
                `${Y} E-Mail${Y > 1 ? "s" : ""} konnten nicht verschoben werden`,
              ),
            o((ee) => {
              const ye = new Set(ee);
              for (const pe of B) ye.delete(pe);
              return ye;
            }),
            d((ee) => (ee && B.includes(ee) ? null : ee)));
        } finally {
          v(!1);
        }
      }
    }, [a, s, i]),
    C = b.useCallback(
      async (H) => {
        const J = a.find((B) => B.email_id === H);
        if (J) {
          g(H);
          try {
            (await $v({
              email_id: J.email_id,
              sender_email: J.sender_email,
              list_unsubscribe_url: J.list_unsubscribe_url,
              list_unsubscribe_mailto: J.list_unsubscribe_mailto,
            }),
              i("ads", H),
              o((B) => {
                const Y = new Set(B);
                return (Y.delete(H), Y);
              }),
              d((B) => (B === H ? null : B)),
              at({
                action: "unsubscribe_requested",
                email_id: H,
                category: "AD",
                result: "success",
                context: { sender_email: J.sender_email },
              }),
              Fe.success("Abmeldung angefordert", {
                description: `${J.sender_name} wird abgemeldet.`,
              }));
          } catch (B) {
            const Y = B instanceof Error ? B.message : "Unbekannter Fehler";
            (at({
              action: "unsubscribe_requested",
              email_id: H,
              category: "AD",
              result: "failure",
              error: Y,
            }),
              Fe.error("Abmeldung fehlgeschlagen", { description: Y }));
          } finally {
            g(null);
          }
        }
      },
      [a, i],
    ),
    X = b.useCallback(
      (H) => {
        const J = y === H.email_id;
        return f.jsxs("div", {
          className: "flex items-center justify-end gap-2",
          children: [
            f.jsx(Ew, { available: H.unsubscribe_available }),
            H.unsubscribe_available
              ? f.jsxs(qe, {
                  variant: "outline",
                  size: "xs",
                  disabled: J,
                  onClick: () => C(H.email_id),
                  children: [
                    J
                      ? f.jsx(gt, { className: "animate-spin" })
                      : f.jsx(w1, {}),
                    "Abmelden",
                  ],
                })
              : null,
          ],
        });
      },
      [C, y],
    ),
    L = s.size,
    F = L > 0;
  return f.jsxs(Kn, {
    children: [
      f.jsx(Jn, {
        children: f.jsxs("div", {
          className: "flex items-center justify-between",
          children: [
            f.jsxs("div", {
              children: [
                f.jsx($n, { children: "Werbung" }),
                f.jsxs(al, {
                  children: [
                    a.length,
                    " ",
                    a.length === 1 ? "E-Mail" : "E-Mails",
                    " ",
                    "erkannt",
                  ],
                }),
              ],
            }),
            F
              ? f.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    f.jsxs("span", {
                      className: "text-sm text-muted-foreground",
                      "aria-live": "polite",
                      "aria-atomic": "true",
                      children: [L, " ausgewählt"],
                    }),
                    f.jsxs(qe, {
                      variant: "destructive",
                      size: "sm",
                      disabled: z,
                      onClick: E,
                      children: [
                        z
                          ? f.jsx(gt, { className: "animate-spin" })
                          : f.jsx(Qc, {}),
                        "Ausgewählte löschen",
                      ],
                    }),
                    f.jsxs(qe, {
                      variant: "outline",
                      size: "sm",
                      disabled: h,
                      onClick: _,
                      children: [
                        h
                          ? f.jsx(gt, { className: "animate-spin" })
                          : f.jsx(wp, {}),
                        "In Posteingang",
                      ],
                    }),
                  ],
                })
              : null,
          ],
        }),
      }),
      f.jsx(Qn, {
        children: f.jsx(Xv, {
          emails: a,
          selectedIds: s,
          expandedId: c,
          onToggleSelect: S,
          onToggleSelectAll: p,
          onToggleExpand: N,
          renderRowActions: X,
          emptyMessage: "Keine Werbung erkannt",
        }),
      }),
    ],
  });
}
function Nw(a) {
  return /\[BITTE ERGÄNZEN:[^\]]*\]/.test(a);
}
function Pv(a) {
  return a > 0.8
    ? "bg-green-100 text-green-800"
    : a >= 0.5
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
}
function _w(a) {
  return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function jw(a) {
  const i = _w(a),
    s = /\[BITTE ERG(?:Ä|&Auml;)NZEN:[^\]]*\]/g;
  return i.replace(
    s,
    (o) =>
      `<mark class="rounded bg-yellow-200 px-0.5 text-yellow-900">${o}</mark>`,
  );
}
function Tw(a) {
  return new Date(a).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function Cw({ confidence: a }) {
  return f.jsxs($t, {
    variant: "outline",
    className: _e("text-[10px] font-mono", Pv(a)),
    children: [Math.round(a * 100), "%"],
  });
}
function Aw({ emails: a, selectedEmailId: i, onSelect: s }) {
  const o = b.useMemo(
    () =>
      [...a].sort(
        (c, d) => new Date(d.date).getTime() - new Date(c.date).getTime(),
      ),
    [a],
  );
  return a.length === 0
    ? f.jsx("div", {
        className: "flex h-full items-center justify-center p-6",
        children: f.jsx("p", {
          className: "text-sm text-muted-foreground",
          children: "Keine Entwürfe zur Prüfung",
        }),
      })
    : f.jsx("div", {
        className: "flex flex-col",
        role: "listbox",
        "aria-label": "E-Mail-Entwürfe",
        children: o.map((c) =>
          f.jsxs(
            "button",
            {
              type: "button",
              role: "option",
              "aria-selected": c.email_id === i,
              onClick: () => s(c.email_id),
              className: _e(
                "flex flex-col gap-1.5 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50",
                c.email_id === i && "bg-accent",
                c.is_escalated && "border-l-2 border-l-red-500",
              ),
              children: [
                f.jsxs("div", {
                  className: "flex items-center justify-between gap-2",
                  children: [
                    f.jsx("span", {
                      className: "truncate text-sm font-medium",
                      children: c.sender_name,
                    }),
                    f.jsxs("div", {
                      className: "flex shrink-0 items-center gap-1.5",
                      children: [
                        c.is_escalated &&
                          f.jsx($t, {
                            variant: "destructive",
                            className: "text-[10px] px-1.5 py-0",
                            children: "Eskaliert",
                          }),
                        f.jsx(Cw, { confidence: c.confidence }),
                      ],
                    }),
                  ],
                }),
                f.jsx("span", {
                  className: "truncate text-sm text-foreground/80",
                  children: c.subject,
                }),
                f.jsxs("div", {
                  className: "flex items-center justify-between gap-2",
                  children: [
                    f.jsx("span", {
                      className: "text-xs text-muted-foreground",
                      children: c.sender_email,
                    }),
                    f.jsx("span", {
                      className: "shrink-0 text-xs text-muted-foreground",
                      children: Tw(c.date),
                    }),
                  ],
                }),
              ],
            },
            c.email_id,
          ),
        ),
      });
}
function Rw(a) {
  let i = a;
  return (
    (i = i.replace(/=\r?\n/g, "")),
    (i = i.replace(/=([0-9A-Fa-f]{2})/g, (s, o) =>
      String.fromCharCode(parseInt(o, 16)),
    )),
    (i = i.replace(/^--[^\n]*$/gm, "")),
    (i = i.replace(
      /^(Content-Type|Content-Transfer-Encoding|Content-Disposition|MIME-Version|charset)\b[^\n]*/gim,
      "",
    )),
    (i = i.replace(/<[^>]+>/g, "")),
    (i = i
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ")),
    (i = i
      .replace(
        /\n{3,}/g,
        `

`,
      )
      .trim()),
    i
  );
}
function zw(a) {
  return new Date(a).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function Mw({ email: a }) {
  const i = a.body_plain ?? a.original_preview,
    s = b.useMemo(() => Rw(i), [i]);
  return f.jsxs(Kn, {
    className: "py-4",
    children: [
      f.jsx(Jn, {
        className: "pb-0",
        children: f.jsx($n, { className: "text-sm", children: "Originalmail" }),
      }),
      f.jsxs(Qn, {
        className: "flex flex-col gap-3",
        children: [
          f.jsxs("div", {
            className: "flex flex-col gap-1 rounded-md bg-muted/50 px-3 py-2",
            children: [
              f.jsxs("div", {
                className: "flex items-baseline justify-between gap-2",
                children: [
                  f.jsx("span", {
                    className: "text-sm font-medium",
                    children: a.sender_name,
                  }),
                  f.jsx("span", {
                    className: "shrink-0 text-xs text-muted-foreground",
                    children: zw(a.date),
                  }),
                ],
              }),
              f.jsx("span", {
                className: "text-xs text-muted-foreground",
                children: a.sender_email,
              }),
            ],
          }),
          f.jsxs("div", {
            children: [
              f.jsx("h4", {
                className: "text-sm font-medium",
                children: a.original_subject,
              }),
              f.jsx("p", {
                className:
                  "mt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line",
                children: s,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function rf({ ...a }) {
  return f.jsx(YE, { "data-slot": "dialog", ...a });
}
function Dw({ ...a }) {
  return f.jsx(qE, { "data-slot": "dialog-trigger", ...a });
}
function Ow({ ...a }) {
  return f.jsx(VE, { "data-slot": "dialog-portal", ...a });
}
function kw({ className: a, ...i }) {
  return f.jsx(XE, {
    "data-slot": "dialog-overlay",
    className: _e(
      "fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
      a,
    ),
    ...i,
  });
}
function sf({ className: a, children: i, showCloseButton: s = !0, ...o }) {
  return f.jsxs(Ow, {
    "data-slot": "dialog-portal",
    children: [
      f.jsx(kw, {}),
      f.jsxs(QE, {
        "data-slot": "dialog-content",
        className: _e(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg",
          a,
        ),
        ...o,
        children: [
          i,
          s &&
            f.jsxs(dv, {
              "data-slot": "dialog-close",
              className:
                "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                f.jsx(Ap, {}),
                f.jsx("span", { className: "sr-only", children: "Close" }),
              ],
            }),
        ],
      }),
    ],
  });
}
function of({ className: a, ...i }) {
  return f.jsx("div", {
    "data-slot": "dialog-header",
    className: _e("flex flex-col gap-2 text-center sm:text-left", a),
    ...i,
  });
}
function uf({ className: a, showCloseButton: i = !1, children: s, ...o }) {
  return f.jsxs("div", {
    "data-slot": "dialog-footer",
    className: _e("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", a),
    ...o,
    children: [
      s,
      i &&
        f.jsx(dv, {
          asChild: !0,
          children: f.jsx(qe, { variant: "outline", children: "Close" }),
        }),
    ],
  });
}
function cf({ className: a, ...i }) {
  return f.jsx(ZE, {
    "data-slot": "dialog-title",
    className: _e("text-lg leading-none font-semibold", a),
    ...i,
  });
}
function ff({ className: a, ...i }) {
  return f.jsx(KE, {
    "data-slot": "dialog-description",
    className: _e("text-sm text-muted-foreground", a),
    ...i,
  });
}
function Xs({ className: a, ...i }) {
  return f.jsx("textarea", {
    "data-slot": "textarea",
    className: _e(
      "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm",
      a,
    ),
    ...i,
  });
}
function Uw({ text: a }) {
  const i = b.useMemo(() => jw(a), [a]);
  return f.jsx("div", {
    "aria-hidden": !0,
    className:
      "pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words px-3 py-2 text-sm text-transparent",
    dangerouslySetInnerHTML: { __html: i },
  });
}
function Lw({
  email: a,
  draftContent: i,
  submittingAction: s,
  onDraftChange: o,
  onApprove: c,
  onReject: d,
}) {
  const [h, v] = b.useState(!1),
    [y, g] = b.useState(""),
    S = b.useMemo(() => Nw(i), [i]),
    p = b.useCallback(() => {
      c(a.email_id, i);
    }, [a.email_id, i, c]),
    N = b.useCallback(async () => {
      (await d(a.email_id, y), v(!1), g(""));
    }, [a.email_id, y, d]),
    z = b.useCallback(() => {
      (v(!1), g(""));
    }, []);
  return f.jsxs(f.Fragment, {
    children: [
      f.jsxs(Kn, {
        className: _e("py-4", a.is_escalated && "border-red-500"),
        children: [
          f.jsx(Jn, {
            className: "pb-0",
            children: f.jsxs("div", {
              className: "flex items-center justify-between gap-2",
              children: [
                f.jsx($n, { className: "text-sm", children: "KI-Entwurf" }),
                f.jsxs("div", {
                  className: "flex items-center gap-2",
                  children: [
                    f.jsxs($t, {
                      variant: "outline",
                      className: _e("text-[11px] font-mono", Pv(a.confidence)),
                      children: [
                        "Konfidenz: ",
                        Math.round(a.confidence * 100),
                        "%",
                      ],
                    }),
                    a.is_escalated &&
                      f.jsx($t, {
                        variant: "destructive",
                        className: "text-[11px]",
                        children: "Eskaliert",
                      }),
                  ],
                }),
              ],
            }),
          }),
          f.jsxs(Qn, {
            className: "flex flex-col gap-3",
            children: [
              f.jsxs("div", {
                className: "flex items-baseline gap-2",
                children: [
                  f.jsx("span", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Betreff:",
                  }),
                  f.jsx("span", { className: "text-sm", children: a.subject }),
                ],
              }),
              f.jsxs("div", {
                className: "flex items-baseline gap-2",
                children: [
                  f.jsx("span", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Sprache:",
                  }),
                  f.jsx("span", {
                    className: "text-sm",
                    children:
                      a.reply_language === "de" ? "Deutsch" : "Englisch",
                  }),
                ],
              }),
              a.review_reason &&
                f.jsxs("div", {
                  className:
                    "rounded-md border border-amber-200 bg-amber-50 px-3 py-2",
                  children: [
                    f.jsx("span", {
                      className: "text-xs font-medium text-amber-800",
                      children: "Prüfungsgrund:",
                    }),
                    f.jsx("p", {
                      className: "mt-0.5 text-sm text-amber-700",
                      children: a.review_reason,
                    }),
                  ],
                }),
              f.jsxs("div", {
                className: "relative",
                children: [
                  f.jsx("label", {
                    htmlFor: `draft-${a.email_id}`,
                    className: "sr-only",
                    children: "Entwurf bearbeiten",
                  }),
                  f.jsx(Uw, { text: i }),
                  f.jsx("textarea", {
                    id: `draft-${a.email_id}`,
                    value: i,
                    onChange: (A) => o(A.target.value),
                    className:
                      "relative min-h-48 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    style: { caretColor: "auto" },
                  }),
                ],
              }),
              S &&
                f.jsx("div", {
                  className:
                    "flex items-center gap-2 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2",
                  role: "alert",
                  children: f.jsx("span", {
                    className: "text-xs font-medium text-yellow-800",
                    children:
                      "Platzhalter vorhanden — bitte alle [BITTE ERGÄNZEN: ...] Felder ausfüllen",
                  }),
                }),
            ],
          }),
          f.jsxs(hw, {
            className: "gap-2",
            children: [
              f.jsxs(qe, {
                onClick: p,
                disabled: S || s !== null,
                title: S
                  ? "Platzhalter müssen ausgefüllt werden"
                  : "Entwurf genehmigen und senden",
                children: [
                  s === "approve"
                    ? f.jsx(gt, { className: "animate-spin" })
                    : null,
                  "Genehmigen & Senden",
                ],
              }),
              f.jsx(qe, {
                variant: "destructive",
                disabled: s !== null,
                onClick: () => v(!0),
                children: "Ablehnen",
              }),
            ],
          }),
        ],
      }),
      f.jsx(rf, {
        open: h,
        onOpenChange: v,
        children: f.jsxs(sf, {
          children: [
            f.jsxs(of, {
              children: [
                f.jsx(cf, { children: "Entwurf ablehnen" }),
                f.jsx(ff, {
                  children:
                    "Möchten Sie diesen Entwurf wirklich ablehnen? Sie können optional einen Grund angeben.",
                }),
              ],
            }),
            f.jsxs("div", {
              children: [
                f.jsx("label", {
                  htmlFor: "reject-reason",
                  className: "text-sm font-medium",
                  children: "Grund (optional)",
                }),
                f.jsx(Xs, {
                  id: "reject-reason",
                  value: y,
                  onChange: (A) => g(A.target.value),
                  placeholder: "Grund für die Ablehnung...",
                  className: "mt-1.5",
                }),
              ],
            }),
            f.jsxs(uf, {
              children: [
                f.jsx(qe, {
                  variant: "outline",
                  disabled: s === "reject",
                  onClick: z,
                  children: "Abbrechen",
                }),
                f.jsxs(qe, {
                  variant: "destructive",
                  disabled: s === "reject",
                  onClick: N,
                  children: [
                    s === "reject"
                      ? f.jsx(gt, { className: "animate-spin" })
                      : null,
                    "Ablehnen",
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
function Bw({ title: a }) {
  return f.jsxs("div", {
    className: "flex h-64 flex-col items-center justify-center gap-2",
    children: [
      f.jsx("p", {
        className: "text-sm font-medium text-muted-foreground",
        children: a,
      }),
      f.jsx("p", {
        className: "text-xs text-muted-foreground/60",
        children: "Keine E-Mails zur Prüfung vorhanden",
      }),
    ],
  });
}
function Hw() {
  return f.jsx("div", {
    className: "flex h-full items-center justify-center",
    children: f.jsx("p", {
      className: "text-sm text-muted-foreground",
      children: "E-Mail aus der Liste auswählen, um den Entwurf zu prüfen",
    }),
  });
}
function eb({ title: a, slice: i }) {
  const s = vt((E) => E[i]),
    o = vt((E) => E.removeEmailById),
    c = Wl((E) => E.selectedEmailId),
    d = Wl((E) => E.setSelectedEmailId),
    h = Wl((E) => E.draftEditorContent),
    v = Wl((E) => E.setDraftEditorContent),
    [y, g] = b.useState(null),
    S = s.find((E) => E.email_id === c) ?? null;
  b.useEffect(() => {
    if (S) {
      const E = S.draft_plain,
        C =
          /\[SIGNATUR EINFÜGEN\]/i.test(E) ||
          /^--\s*$/m.test(E) ||
          /mit freundlichen grüßen/i.test(E) ||
          /best regards/i.test(E) ||
          /kind regards/i.test(E)
            ? E
            : `${E.trimEnd()}

[SIGNATUR EINFÜGEN]`;
      v(C);
    }
  }, [S?.email_id]);
  const p = b.useCallback(
      (E) => {
        d(E);
      },
      [d],
    ),
    N = b.useCallback(
      (E) => {
        v(E);
      },
      [v],
    ),
    z = b.useCallback(
      async (E, _) => {
        const C = s.find((X) => X.email_id === E);
        if (C) {
          g("approve");
          try {
            (await Zv({
              email_id: E,
              draft_html: C.draft_html,
              draft_plain: _,
              sender_email: C.sender_email,
              subject: C.subject,
              reply_language: C.reply_language,
            }),
              o(E),
              Vs(E, { status: "sent" }).catch(() => {}),
              d(null),
              v(""),
              at({
                action: "draft_approved",
                email_id: E,
                category: i.toUpperCase(),
                result: "success",
                context: {
                  sender_email: C.sender_email,
                  subject: C.subject,
                  reply_language: C.reply_language,
                },
              }),
              Fe.success("E-Mail gesendet", {
                description: "Die Antwort wurde erfolgreich versendet.",
              }));
          } catch (X) {
            const L = X instanceof Error ? X.message : "Unbekannter Fehler";
            (at({
              action: "draft_approved",
              email_id: E,
              category: i.toUpperCase(),
              result: "failure",
              error: L,
            }),
              Fe.error("Genehmigung fehlgeschlagen", { description: L }));
          } finally {
            g(null);
          }
        }
      },
      [s, i, o, d, v],
    ),
    A = b.useCallback(
      async (E, _) => {
        g("reject");
        try {
          (await Kv({ email_id: E, reason: _ || void 0 }),
            o(E),
            Vs(E, { status: "rejected" }).catch(() => {}),
            d(null),
            v(""),
            at({
              action: "draft_rejected",
              email_id: E,
              category: i.toUpperCase(),
              result: "success",
              context: { reason: _ || void 0 },
            }),
            Fe.info("Entwurf abgelehnt", {
              description: _ ? `Grund: ${_}` : "Ohne Angabe von Gründen.",
            }));
        } catch (C) {
          const X = C instanceof Error ? C.message : "Unbekannter Fehler";
          (at({
            action: "draft_rejected",
            email_id: E,
            category: i.toUpperCase(),
            result: "failure",
            error: X,
          }),
            Fe.error("Ablehnung fehlgeschlagen", { description: X }));
        } finally {
          g(null);
        }
      },
      [i, o, d, v],
    );
  return s.length === 0
    ? f.jsx(Bw, { title: a })
    : f.jsxs("div", {
        className: "grid h-full grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]",
        children: [
          f.jsxs("div", {
            className:
              "overflow-hidden rounded-lg border border-border bg-card",
            children: [
              f.jsxs("div", {
                className: "border-b border-border px-4 py-3",
                children: [
                  f.jsx("h2", {
                    className: "text-sm font-semibold",
                    children: a,
                  }),
                  f.jsxs("p", {
                    className: "text-xs text-muted-foreground",
                    children: [
                      s.length,
                      " ",
                      s.length === 1 ? "Entwurf" : "Entwürfe",
                      " zur Prüfung",
                    ],
                  }),
                ],
              }),
              f.jsx("div", {
                className: "max-h-[calc(100vh-280px)] overflow-y-auto",
                children: f.jsx(Aw, {
                  emails: s,
                  selectedEmailId: c,
                  onSelect: p,
                }),
              }),
            ],
          }),
          f.jsx("div", {
            className: "flex flex-col gap-4",
            children: S
              ? f.jsxs(f.Fragment, {
                  children: [
                    f.jsx(Mw, { email: S }),
                    f.jsx(Lw, {
                      email: S,
                      draftContent: h,
                      submittingAction: y,
                      onDraftChange: N,
                      onApprove: z,
                      onReject: A,
                    }),
                  ],
                })
              : f.jsx(Hw, {}),
          }),
        ],
      });
}
function Gw() {
  return f.jsx(eb, { title: "Dringend", slice: "urgent" });
}
function Yw() {
  return f.jsx(eb, { title: "Sonstige", slice: "other" });
}
function qw(a) {
  return a <= -0.6
    ? "bg-red-500"
    : a <= -0.3
      ? "bg-orange-500"
      : a <= 0
        ? "bg-amber-400"
        : a <= 0.3
          ? "bg-yellow-300"
          : a <= 0.6
            ? "bg-lime-400"
            : "bg-green-500";
}
function Vw(a) {
  return a <= -0.6
    ? "text-red-700"
    : a <= -0.3
      ? "text-orange-700"
      : a <= 0
        ? "text-amber-700"
        : a <= 0.3
          ? "text-yellow-700"
          : a <= 0.6
            ? "text-lime-700"
            : "text-green-700";
}
function Xw(a) {
  return a <= -0.6
    ? "Sehr negativ"
    : a <= -0.3
      ? "Negativ"
      : a <= 0
        ? "Leicht negativ"
        : a <= 0.3
          ? "Neutral"
          : a <= 0.6
            ? "Positiv"
            : "Sehr positiv";
}
function Qw(a) {
  return Math.round(((a + 1) / 2) * 100);
}
function Zw({ score: a }) {
  const i = Qw(a),
    s = qw(a),
    o = Vw(a),
    c = Xw(a);
  return f.jsxs("div", {
    className: "flex flex-col gap-1",
    children: [
      f.jsxs("div", {
        className: "flex items-center justify-between gap-2",
        children: [
          f.jsx("span", {
            className: "text-xs text-muted-foreground",
            children: "Stimmung",
          }),
          f.jsxs("span", {
            className: _e("text-xs font-medium", o),
            children: [a.toFixed(1), " — ", c],
          }),
        ],
      }),
      f.jsx("div", {
        className: "h-2 w-full overflow-hidden rounded-full bg-muted",
        role: "meter",
        "aria-valuenow": a,
        "aria-valuemin": -1,
        "aria-valuemax": 1,
        "aria-label": `Stimmungswert: ${a.toFixed(1)}`,
        children: f.jsx("div", {
          className: _e("h-full rounded-full transition-all", s),
          style: { width: `${i}%` },
        }),
      }),
    ],
  });
}
const Jg = {
  low: {
    label: "Abwanderung: Gering",
    className: "border-yellow-300 bg-yellow-50 text-yellow-800",
  },
  medium: {
    label: "Abwanderung: Mittel",
    className: "border-orange-300 bg-orange-50 text-orange-800",
  },
  high: {
    label: "Abwanderung: Hoch",
    className: "border-red-300 bg-red-50 text-red-800",
  },
};
function Kw({ complaintRisk: a, legalThreat: i, churnRisk: s }) {
  const o = [
    ...(i
      ? [
          {
            key: "legal",
            label: "Rechtliche Drohung",
            className: "border-red-400 bg-red-100 text-red-900",
          },
        ]
      : []),
    ...(a
      ? [
          {
            key: "complaint",
            label: "Beschwerde",
            className: "border-orange-300 bg-orange-50 text-orange-800",
          },
        ]
      : []),
    { key: "churn", label: Jg[s].label, className: Jg[s].className },
  ];
  return f.jsx("div", {
    className: "flex flex-wrap gap-1.5",
    children: o.map((c) =>
      f.jsx(
        $t,
        {
          variant: "outline",
          className: _e("text-[11px]", c.className),
          children: c.label,
        },
        c.key,
      ),
    ),
  });
}
function Jw(a, i) {
  return a.legal_threat !== i.legal_threat
    ? a.legal_threat
      ? -1
      : 1
    : a.sentiment_score - i.sentiment_score;
}
function $w(a) {
  return new Date(a).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function Fw({ urgency: a }) {
  const i = a >= 4 ? "destructive" : a >= 3 ? "default" : "secondary";
  return f.jsxs($t, {
    variant: i,
    className: "text-[11px]",
    children: ["Dringlichkeit: ", a, "/5"],
  });
}
function Ww({ alert: a }) {
  const i = vt((_) => _.removeEmailById),
    [s, o] = b.useState(a.draft_plain ?? ""),
    [c, d] = b.useState(!!a.draft_plain),
    [h, v] = b.useState(null),
    [y, g] = b.useState(""),
    [S, p] = b.useState(!1),
    N = b.useRef(null),
    z = b.useCallback(() => {
      (d(!0), requestAnimationFrame(() => N.current?.focus()));
    }, []),
    A = b.useCallback(async () => {
      if (s.trim() === "") {
        Fe.error("Antwort ist leer", {
          description: "Bitte schreiben Sie eine Antwort.",
        });
        return;
      }
      v("approve");
      try {
        (await Zv({
          email_id: a.email_id,
          draft_html: `<p>${s.replace(/\n/g, "<br>")}</p>`,
          draft_plain: s,
          sender_email: a.sender_email,
          subject: `Re: ${a.subject}`,
          reply_language: "de",
        }),
          i(a.email_id),
          Vs(a.email_id, { status: "approved" }).catch(() => {}),
          at({
            action: "draft_approved",
            email_id: a.email_id,
            category: "ESCALATION",
            result: "success",
          }),
          Fe.success("Antwort gesendet"));
      } catch (_) {
        const C = _ instanceof Error ? _.message : "Unbekannter Fehler";
        (at({
          action: "draft_approved",
          email_id: a.email_id,
          category: "ESCALATION",
          result: "failure",
          error: C,
        }),
          Fe.error("Senden fehlgeschlagen", { description: C }));
      } finally {
        v(null);
      }
    }, [a, s, i]),
    E = b.useCallback(async () => {
      (p(!1), v("reject"));
      try {
        (await Kv({ email_id: a.email_id, reason: y || void 0 }),
          i(a.email_id),
          Vs(a.email_id, { status: "rejected" }).catch(() => {}),
          at({
            action: "draft_rejected",
            email_id: a.email_id,
            category: "ESCALATION",
            result: "success",
          }),
          Fe.success("Eskalation abgelehnt"));
      } catch (_) {
        const C = _ instanceof Error ? _.message : "Unbekannter Fehler";
        (at({
          action: "draft_rejected",
          email_id: a.email_id,
          category: "ESCALATION",
          result: "failure",
          error: C,
        }),
          Fe.error("Ablehnen fehlgeschlagen", { description: C }));
      } finally {
        (v(null), g(""));
      }
    }, [a.email_id, y, i]);
  return f.jsxs(Kn, {
    children: [
      f.jsx(Jn, {
        children: f.jsxs("div", {
          className: "flex items-start justify-between gap-4",
          children: [
            f.jsxs("div", {
              className: "flex-1 space-y-1",
              children: [
                f.jsx($n, { className: "text-base", children: a.subject }),
                f.jsxs(al, {
                  children: [a.sender_name, " <", a.sender_email, ">"],
                }),
              ],
            }),
            f.jsxs("div", {
              className: "flex shrink-0 items-center gap-2",
              children: [
                f.jsx(Fw, { urgency: a.urgency }),
                f.jsx("span", {
                  className: "text-xs text-muted-foreground",
                  children: $w(a.timestamp),
                }),
              ],
            }),
          ],
        }),
      }),
      f.jsxs(Qn, {
        className: "space-y-4",
        children: [
          f.jsx(Zw, { score: a.sentiment_score }),
          f.jsx(Kw, {
            complaintRisk: a.complaint_risk,
            legalThreat: a.legal_threat,
            churnRisk: a.churn_risk,
          }),
          (a.body_plain ?? a.preview) &&
            f.jsxs("div", {
              className: "rounded-md border border-border bg-muted/50 p-3",
              children: [
                f.jsx("p", {
                  className: "text-xs font-medium text-muted-foreground",
                  children: "Originalmail",
                }),
                f.jsx("p", {
                  className: "mt-1 whitespace-pre-wrap text-sm",
                  children: a.body_plain ?? a.preview,
                }),
              ],
            }),
          f.jsxs("div", {
            className: "rounded-md border border-border bg-muted/50 p-3",
            children: [
              f.jsx("p", {
                className: "text-xs font-medium text-muted-foreground",
                children: "Zusammenfassung",
              }),
              f.jsx("p", { className: "mt-1 text-sm", children: a.summary }),
            ],
          }),
          f.jsxs("div", {
            className: "space-y-3 rounded-md border border-border p-3",
            children: [
              f.jsxs("div", {
                className: "flex items-center justify-between",
                children: [
                  f.jsx("p", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Antwort",
                  }),
                  !c &&
                    f.jsx(qe, {
                      variant: "outline",
                      size: "sm",
                      onClick: z,
                      children: "Bearbeiten",
                    }),
                ],
              }),
              f.jsx(Xs, {
                ref: N,
                className: "min-h-[120px] resize-y bg-background text-sm",
                placeholder: "Antwort verfassen…",
                value: s,
                readOnly: !c,
                onChange: (_) => o(_.target.value),
              }),
              f.jsxs("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                  f.jsx(qe, {
                    size: "sm",
                    disabled: h !== null || s.trim() === "",
                    onClick: A,
                    children:
                      h === "approve"
                        ? "Wird gesendet…"
                        : "Genehmigen & Senden",
                  }),
                  f.jsxs(rf, {
                    open: S,
                    onOpenChange: p,
                    children: [
                      f.jsx(Dw, {
                        asChild: !0,
                        children: f.jsx(qe, {
                          variant: "outline",
                          size: "sm",
                          disabled: h !== null,
                          children: "Ablehnen",
                        }),
                      }),
                      f.jsxs(sf, {
                        children: [
                          f.jsxs(of, {
                            children: [
                              f.jsx(cf, { children: "Eskalation ablehnen" }),
                              f.jsx(ff, {
                                children:
                                  "Optional: Geben Sie einen Grund für die Ablehnung an.",
                              }),
                            ],
                          }),
                          f.jsx(Xs, {
                            placeholder: "Grund (optional)",
                            value: y,
                            onChange: (_) => g(_.target.value),
                          }),
                          f.jsxs(uf, {
                            children: [
                              f.jsx(qe, {
                                variant: "outline",
                                onClick: () => p(!1),
                                children: "Abbrechen",
                              }),
                              f.jsx(qe, {
                                variant: "destructive",
                                disabled: h !== null,
                                onClick: E,
                                children:
                                  h === "reject"
                                    ? "Wird abgelehnt…"
                                    : "Ablehnen",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Iw() {
  const a = vt((s) => s.escalations),
    i = b.useMemo(() => [...a].sort(Jw), [a]);
  return i.length === 0
    ? f.jsx(Kn, {
        children: f.jsxs(Jn, {
          children: [
            f.jsx($n, { children: "Eskalation" }),
            f.jsx(al, { children: "Keine aktiven Eskalationen" }),
          ],
        }),
      })
    : f.jsxs("div", {
        className: "space-y-4",
        children: [
          f.jsxs("div", {
            children: [
              f.jsx("h2", {
                className: "text-lg font-semibold",
                children: "Eskalation",
              }),
              f.jsxs("p", {
                className: "mt-1 text-sm text-muted-foreground",
                children: [
                  i.length,
                  " ",
                  i.length === 1 ? "Warnung" : "Warnungen",
                  " aktiv",
                ],
              }),
            ],
          }),
          f.jsx("div", {
            className: "grid gap-4",
            children: i.map((s) => f.jsx(Ww, { alert: s }, s.email_id)),
          }),
        ],
      });
}
const Pw = {
  erfolgreich: {
    label: "Erfolgreich",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  "nicht erfolgreich": {
    label: "Fehlgeschlagen",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};
function eN({ status: a }) {
  const i = Pw[a];
  return f.jsx($t, {
    variant: "outline",
    className: _e(i.className),
    children: i.label,
  });
}
const tN = {
  "one-click": "One-Click",
  mailto: "Mailto",
  "not-found": "Nicht gefunden",
};
function nN({ method: a }) {
  return f.jsx($t, { variant: "secondary", children: tN[a] });
}
function aN(a) {
  return new Date(a).toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function lN({ entry: a, isRetrying: i, onRetry: s }) {
  const o = b.useCallback(() => {
    s(a.email_id);
  }, [a.email_id, s]);
  return f.jsxs(Ra, {
    children: [
      f.jsx(nt, { className: "font-medium", children: a.sender }),
      f.jsx(nt, { children: f.jsx(nN, { method: a.unsubscribe_method }) }),
      f.jsx(nt, { children: f.jsx(eN, { status: a.status }) }),
      f.jsx(nt, {
        className: "max-w-[300px] truncate text-muted-foreground",
        children: a.reason,
      }),
      f.jsx(nt, {
        className: "text-muted-foreground",
        children: aN(a.timestamp),
      }),
      f.jsx(nt, {
        children:
          a.status === "nicht erfolgreich" &&
          f.jsxs(qe, {
            variant: "outline",
            size: "sm",
            disabled: i,
            onClick: o,
            children: [
              i ? f.jsx(gt, { className: "animate-spin" }) : null,
              "Erneut versuchen",
            ],
          }),
      }),
    ],
  });
}
function iN({ entries: a, retryingIds: i, onRetry: s }) {
  return f.jsxs(tf, {
    children: [
      f.jsx(nf, {
        children: f.jsxs(Ra, {
          children: [
            f.jsx(ut, { children: "Absender" }),
            f.jsx(ut, { children: "Methode" }),
            f.jsx(ut, { children: "Status" }),
            f.jsx(ut, { children: "Grund" }),
            f.jsx(ut, { children: "Zeitpunkt" }),
            f.jsx(ut, { className: "w-[140px]", children: "Aktion" }),
          ],
        }),
      }),
      f.jsx(af, {
        children: a.map((o) =>
          f.jsx(
            lN,
            { entry: o, isRetrying: i.has(o.email_id), onRetry: s },
            o.email_id,
          ),
        ),
      }),
    ],
  });
}
function rN() {
  const a = vt((h) => h.unsubscribes),
    i = a.length,
    s = vt(
      (h) =>
        h.unsubscribes.filter((v) => v.status === "nicht erfolgreich").length,
    ),
    [o, c] = b.useState(new Set()),
    d = b.useCallback(
      async (h) => {
        const v = a.find((y) => y.email_id === h);
        if (v) {
          c((y) => new Set([...y, h]));
          try {
            (await $v({ email_id: v.email_id, sender_email: v.sender }),
              at({
                action: "unsubscribe_retried",
                email_id: h,
                category: "UNSUBSCRIBE",
                result: "success",
                context: { sender: v.sender },
              }),
              Fe.success("Abmeldung erneut angefordert", {
                description: `${v.sender} wird erneut versucht.`,
              }));
          } catch (y) {
            const g = y instanceof Error ? y.message : "Unbekannter Fehler";
            (at({
              action: "unsubscribe_retried",
              email_id: h,
              category: "UNSUBSCRIBE",
              result: "failure",
              error: g,
            }),
              Fe.error("Erneuter Versuch fehlgeschlagen", { description: g }));
          } finally {
            c((y) => {
              const g = new Set(y);
              return (g.delete(h), g);
            });
          }
        }
      },
      [a],
    );
  return f.jsxs(Kn, {
    children: [
      f.jsxs(Jn, {
        children: [
          f.jsx($n, { children: "Abmeldungen" }),
          f.jsx(al, {
            children:
              i === 0
                ? "Keine Abmeldungen vorhanden"
                : `${i} gesamt${s > 0 ? `, ${s} fehlgeschlagen` : ""}`,
          }),
        ],
      }),
      i > 0
        ? f.jsx(Qn, {
            children: f.jsx(iN, { entries: a, retryingIds: o, onRetry: d }),
          })
        : null,
    ],
  });
}
function sN(a) {
  const i = new Date(a);
  return isNaN(i.getTime())
    ? "—"
    : new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(i);
}
function oN({ email: a }) {
  return f.jsx(Ra, {
    children: f.jsx(nt, {
      colSpan: 5,
      className: "bg-muted/30 px-6 py-4",
      children: f.jsxs("div", {
        className: "flex flex-col gap-3",
        children: [
          f.jsxs("div", {
            children: [
              f.jsx("span", {
                className:
                  "text-xs font-medium uppercase tracking-wide text-muted-foreground",
                children: "Gesendeter Text",
              }),
              f.jsx("p", {
                className: "mt-1 whitespace-pre-wrap text-sm text-foreground",
                children: a.draft_plain,
              }),
            ],
          }),
          f.jsx("div", {
            className: "flex items-center gap-4 text-xs text-muted-foreground",
            children: f.jsxs("span", {
              children: ["E-Mail: ", a.sender_email],
            }),
          }),
        ],
      }),
    }),
  });
}
function uN() {
  const a = vt((g) => g.sent),
    i = vt((g) => g.setSentEmails),
    [s, o] = b.useState(!1),
    [c, d] = b.useState(!1),
    [h, v] = b.useState(null);
  b.useEffect(() => {
    c ||
      (o(!0),
      fetch("/api/emails/sent", { signal: AbortSignal.timeout(1e4) })
        .then((g) => g.json())
        .then((g) => {
          g.success && g.data && i(g.data);
        })
        .catch(() => {})
        .finally(() => {
          (o(!1), d(!0));
        }));
  }, [c, i]);
  const y = b.useCallback((g) => {
    v((S) => (S === g ? null : g));
  }, []);
  return s
    ? f.jsxs(Kn, {
        children: [
          f.jsxs(Jn, {
            children: [
              f.jsx($n, { children: "Gesendet" }),
              f.jsx(al, { children: "Lade gesendete E-Mails..." }),
            ],
          }),
          f.jsx(Qn, {
            children: f.jsx("div", {
              className: "flex items-center justify-center py-16",
              children: f.jsx(gt, {
                className: "size-8 animate-spin text-muted-foreground",
              }),
            }),
          }),
        ],
      })
    : f.jsxs(Kn, {
        children: [
          f.jsxs(Jn, {
            children: [
              f.jsx($n, { children: "Gesendet" }),
              f.jsx(al, {
                children:
                  a.length === 0
                    ? "Keine gesendeten E-Mails vorhanden"
                    : `${a.length} ${a.length === 1 ? "E-Mail" : "E-Mails"} gesendet`,
              }),
            ],
          }),
          a.length > 0
            ? f.jsx(Qn, {
                children: f.jsxs(tf, {
                  children: [
                    f.jsx(nf, {
                      children: f.jsxs(Ra, {
                        children: [
                          f.jsx(ut, { className: "w-6" }),
                          f.jsx(ut, { children: "Absender" }),
                          f.jsx(ut, { children: "Betreff" }),
                          f.jsx(ut, { children: "Datum" }),
                          f.jsx(ut, { children: "Status" }),
                        ],
                      }),
                    }),
                    f.jsx(af, {
                      children: a.map((g) => {
                        const S = h === g.email_id;
                        return f.jsx(
                          cN,
                          { email: g, isExpanded: S, onToggleExpand: y },
                          g.email_id,
                        );
                      }),
                    }),
                  ],
                }),
              })
            : f.jsx(Qn, {
                children: f.jsxs("div", {
                  className:
                    "flex flex-col items-center justify-center py-16 text-center",
                  children: [
                    f.jsx(Tp, {
                      className: "size-12 text-muted-foreground/40",
                    }),
                    f.jsx("p", {
                      className: "mt-4 text-sm text-muted-foreground",
                      children: "Keine gesendeten E-Mails vorhanden",
                    }),
                  ],
                }),
              }),
        ],
      });
}
function cN({ email: a, isExpanded: i, onToggleExpand: s }) {
  const o = b.useCallback(() => {
    s(a.email_id);
  }, [s, a.email_id]);
  return f.jsxs(f.Fragment, {
    children: [
      f.jsxs(Ra, {
        className: "cursor-pointer",
        onClick: o,
        children: [
          f.jsx(nt, {
            className: "px-0",
            children: i
              ? f.jsx(Np, { className: "size-4 text-muted-foreground" })
              : f.jsx(_p, { className: "size-4 text-muted-foreground" }),
          }),
          f.jsx(nt, {
            children: f.jsxs("div", {
              className: "flex flex-col",
              children: [
                f.jsx("span", {
                  className: "font-medium",
                  children: a.sender_name,
                }),
                f.jsx("span", {
                  className: "text-xs text-muted-foreground",
                  children: a.sender_email,
                }),
              ],
            }),
          }),
          f.jsx(nt, { className: "max-w-xs truncate", children: a.subject }),
          f.jsx(nt, {
            className: "text-muted-foreground",
            children: sN(a.timestamp),
          }),
          f.jsx(nt, {
            children: f.jsx($t, {
              variant: "secondary",
              children: "Genehmigt",
            }),
          }),
        ],
      }),
      i ? f.jsx(oN, { email: a }) : null,
    ],
  });
}
const $g = [
  { key: "spam", label: "Spam" },
  { key: "ads", label: "Werbung" },
  { key: "urgent", label: "Dringend" },
  { key: "other", label: "Sonstige" },
  { key: "escalations", label: "Eskalation" },
  { key: "unsubscribes", label: "Abmeldungen" },
  { key: "sent", label: "Gesendet" },
];
function fN(a) {
  return vt((i) => {
    switch (a) {
      case "spam":
        return i.spam.length;
      case "ads":
        return i.ads.length;
      case "urgent":
        return i.urgent.length;
      case "other":
        return i.other.length;
      case "escalations":
        return i.escalations.length;
      case "unsubscribes":
        return i.unsubscribes.filter((s) => s.status === "nicht erfolgreich")
          .length;
      case "sent":
        return 0;
      default:
        return 0;
    }
  });
}
function dN({ slice: a }) {
  const i = fN(a);
  return i === 0
    ? null
    : f.jsx($t, {
        variant: "default",
        className: "ml-1.5 px-1.5 py-0 text-[10px] leading-4",
        children: i,
      });
}
function mN({ slice: a }) {
  switch (a) {
    case "spam":
      return f.jsx(Sw, {});
    case "ads":
      return f.jsx(ww, {});
    case "urgent":
      return f.jsx(Gw, {});
    case "other":
      return f.jsx(Yw, {});
    case "escalations":
      return f.jsx(Iw, {});
    case "unsubscribes":
      return f.jsx(rN, {});
    case "sent":
      return f.jsx(uN, {});
    default:
      return null;
  }
}
function hN() {
  const a = Wl((s) => s.activeTab),
    i = Wl((s) => s.setActiveTab);
  return f.jsxs(uw, {
    value: a,
    onValueChange: (s) => i(s),
    className: "flex-1",
    children: [
      f.jsx("div", {
        className: "border-b border-border bg-background px-4 md:px-6",
        children: f.jsx(fw, {
          variant: "line",
          className: "h-10 w-full justify-start gap-0",
          children: $g.map((s) =>
            f.jsxs(
              dw,
              {
                value: s.key,
                className: "px-3 py-2 text-sm",
                children: [s.label, f.jsx(dN, { slice: s.key })],
              },
              s.key,
            ),
          ),
        }),
      }),
      f.jsx("div", {
        className: "flex-1 p-4 md:p-6",
        children: $g.map((s) =>
          f.jsx(
            mw,
            { value: s.key, children: f.jsx(mN, { slice: s.key }) },
            s.key,
          ),
        ),
      }),
    ],
  });
}
const gN = "/api/emails",
  pN = 2e4,
  vN = 15,
  bN = 6e4;
async function tb() {
  try {
    const a = await fetch(gN);
    if (!a.ok) return null;
    const i = await a.json();
    return i.success ? i : null;
  } catch {
    return null;
  }
}
async function yN() {
  const a = await tb();
  a && vt.getState().hydrateFromServer(a.data);
}
async function xN() {
  const a = await tb();
  return a ? vt.getState().mergeFromServer(a.data) : !1;
}
function SN(a = {}) {
  const { enabled: i = !0 } = a,
    [s, o] = b.useState(i ? "connecting" : "disconnected"),
    [c, d] = b.useState(!1),
    h = b.useRef(0);
  return (
    b.useEffect(() => {
      if (!i) return;
      yN();
      const v = Date.now();
      ((h.current = 0), d(!0), o("connected"));
      const y = setInterval(() => {
        xN().then((g) => {
          (g ? (h.current = 0) : (h.current += 1),
            Date.now() - v > bN && d(!1),
            h.current >= vN && (clearInterval(y), d(!1), o("disconnected")));
        });
      }, pN);
      return () => {
        (clearInterval(y), d(!1), o("connecting"));
      };
    }, [i]),
    { status: s, isSyncing: c }
  );
}
function EN() {
  const a = Zs(),
    i = b.useRef(!1),
    s = ei((d) => d.isVerified),
    o = ei((d) => d.isLoading);
  (b.useEffect(() => {
    i.current || ((i.current = !0), ei.getState().checkAuth());
  }, []),
    b.useEffect(() => {
      !o && !s && a("/login", { replace: !0 });
    }, [o, s, a]));
  const { isSyncing: c } = SN({ enabled: s });
  return o
    ? f.jsx("div", {
        className: "flex min-h-screen items-center justify-center bg-[#f8f9fa]",
        children: f.jsx(gt, { className: "size-8 animate-spin text-gray-400" }),
      })
    : s
      ? f.jsxs("div", {
          className: "flex min-h-screen flex-col bg-[#f8f9fa]",
          children: [
            f.jsx(ow, { isSyncing: c }),
            f.jsx("main", {
              className: "flex flex-1 flex-col",
              children: f.jsx(hN, {}),
            }),
            f.jsx(uS, {}),
          ],
        })
      : null;
}
function Fg({ className: a, type: i, ...s }) {
  return f.jsx("input", {
    type: i,
    "data-slot": "input",
    className: _e(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
      a,
    ),
    ...s,
  });
}
function Wg({ className: a, ...i }) {
  return f.jsx(s2, {
    "data-slot": "label",
    className: _e(
      "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      a,
    ),
    ...i,
  });
}
function wN() {
  const a = Zs(),
    [i, s] = b.useState("email"),
    [o, c] = b.useState(""),
    [d, h] = b.useState(""),
    [v, y] = b.useState(""),
    [g, S] = b.useState(!1);
  async function p(z) {
    (z.preventDefault(), y(""), S(!0));
    try {
      const A = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: o }),
      });
      if (A.ok) s("code");
      else {
        const E = await A.json().catch(() => ({}));
        y(E.error ?? "Code konnte nicht gesendet werden.");
      }
    } catch {
      y("Netzwerkfehler — Server nicht erreichbar.");
    } finally {
      S(!1);
    }
  }
  async function N(z) {
    (z.preventDefault(), y(""), S(!0));
    try {
      const A = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: o, code: d }),
      });
      if (A.ok) {
        const E = await A.json();
        (ei.getState().setUser(E), a("/", { replace: !0 }));
      } else {
        const E = await A.json().catch(() => ({}));
        y(E.error ?? "Ungültiger oder abgelaufener Code.");
      }
    } catch {
      y("Netzwerkfehler — Server nicht erreichbar.");
    } finally {
      S(!1);
    }
  }
  return f.jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-[#f8f9fa]",
    children: f.jsxs("div", {
      className: "w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm",
      children: [
        f.jsxs("div", {
          className: "mb-6 text-center",
          children: [
            f.jsx("h1", {
              className: "text-lg font-bold lowercase text-foreground",
              children: "siteware",
            }),
            f.jsx("p", {
              className: "mt-1 text-sm text-muted-foreground",
              children: "E-Mail Automation",
            }),
          ],
        }),
        i === "email"
          ? f.jsxs("form", {
              onSubmit: p,
              className: "space-y-4",
              children: [
                f.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    f.jsx(Wg, { htmlFor: "email", children: "E-Mail-Adresse" }),
                    f.jsx(Fg, {
                      id: "email",
                      type: "email",
                      placeholder: "name@firma.de",
                      value: o,
                      onChange: (z) => c(z.target.value),
                      required: !0,
                      autoFocus: !0,
                      autoComplete: "email",
                    }),
                  ],
                }),
                v &&
                  f.jsx("p", {
                    className: "text-sm text-red-600",
                    role: "alert",
                    children: v,
                  }),
                f.jsxs(qe, {
                  type: "submit",
                  className: "w-full cursor-pointer",
                  disabled: g || !o,
                  children: [
                    g && f.jsx(gt, { className: "mr-2 size-4 animate-spin" }),
                    "Code anfordern",
                  ],
                }),
              ],
            })
          : f.jsxs("form", {
              onSubmit: N,
              className: "space-y-4",
              children: [
                f.jsxs("p", {
                  className: "text-sm text-muted-foreground",
                  children: [
                    "Wir haben einen 6-stelligen Code an",
                    " ",
                    f.jsx("span", {
                      className: "font-medium text-foreground",
                      children: o,
                    }),
                    " ",
                    "gesendet.",
                  ],
                }),
                f.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    f.jsx(Wg, {
                      htmlFor: "code",
                      children: "Bestätigungscode",
                    }),
                    f.jsx(Fg, {
                      id: "code",
                      type: "text",
                      inputMode: "numeric",
                      pattern: "[0-9]{6}",
                      maxLength: 6,
                      placeholder: "000000",
                      value: d,
                      onChange: (z) =>
                        h(z.target.value.replace(/\D/g, "").slice(0, 6)),
                      required: !0,
                      autoFocus: !0,
                      autoComplete: "one-time-code",
                      className: "text-center text-lg tracking-[0.3em]",
                    }),
                  ],
                }),
                v &&
                  f.jsx("p", {
                    className: "text-sm text-red-600",
                    role: "alert",
                    children: v,
                  }),
                f.jsxs(qe, {
                  type: "submit",
                  className: "w-full cursor-pointer",
                  disabled: g || d.length !== 6,
                  children: [
                    g && f.jsx(gt, { className: "mr-2 size-4 animate-spin" }),
                    "Anmelden",
                  ],
                }),
                f.jsx("button", {
                  type: "button",
                  className:
                    "w-full cursor-pointer text-sm text-muted-foreground hover:text-foreground",
                  onClick: () => {
                    (s("email"), h(""), y(""));
                  },
                  children: "Andere E-Mail verwenden",
                }),
              ],
            }),
      ],
    }),
  });
}
const NN = [
    { value: "professionell", label: "Professionell" },
    { value: "formell", label: "Formell" },
    { value: "sachlich", label: "Sachlich" },
    { value: "komplex", label: "Komplex" },
    { value: "einfach", label: "Einfach" },
    { value: "konservativ", label: "Konservativ" },
    { value: "modern", label: "Modern" },
    { value: "wissenschaftlich", label: "Wissenschaftlich" },
    { value: "fachspezifisch", label: "Fachspezifisch" },
    { value: "abstrakt", label: "Abstrakt" },
    { value: "klar", label: "Klar" },
    { value: "direkt", label: "Direkt" },
    { value: "rhetorisch", label: "Rhetorisch" },
    { value: "ausdrucksstark", label: "Ausdrucksstark" },
  ],
  _N = [
    { value: "so-kurz-wie-moeglich", label: "So kurz wie möglich" },
    { value: "sehr-kurz", label: "Sehr kurz" },
    { value: "kurz", label: "Kurz" },
    { value: "mittlerer-umfang", label: "Mittlerer Umfang" },
    { value: "detailliert", label: "Detailliert" },
    { value: "umfangreich", label: "Umfangreich" },
    { value: "sehr-detailliert", label: "Sehr detailliert" },
  ];
function jN(a, i) {
  return {
    anrede: a.anrede ?? (a.formality_level === "informal" ? "du" : "sie"),
    sprachstil: a.sprachstil ?? [],
    emailLength: a.email_length ?? "mittlerer-umfang",
    signature: i,
    typicalPhrases: [...a.typical_phrases],
    industryJargon: [...a.industry_jargon],
    greeting: a.greeting_style,
    closing: a.closing_style,
  };
}
function Ig({ label: a, tags: i, onChange: s, placeholder: o }) {
  const [c, d] = b.useState("");
  function h(y) {
    if ((y.key === "Enter" || y.key === ",") && c.trim() !== "") {
      y.preventDefault();
      const g = c.trim();
      (i.includes(g) || s([...i, g]), d(""));
    }
    y.key === "Backspace" && c === "" && i.length > 0 && s(i.slice(0, -1));
  }
  function v(y) {
    s([...i.slice(0, y), ...i.slice(y + 1)]);
  }
  return f.jsxs("div", {
    children: [
      f.jsx("label", {
        className: "mb-1.5 block text-sm font-medium text-foreground",
        children: a,
      }),
      f.jsxs("div", {
        className:
          "flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2",
        children: [
          i.map((y, g) =>
            f.jsxs(
              "span",
              {
                className:
                  "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground",
                children: [
                  y,
                  f.jsx("button", {
                    type: "button",
                    className:
                      "cursor-pointer text-muted-foreground hover:text-foreground",
                    onClick: () => v(g),
                    children: f.jsx(Ap, { className: "size-3" }),
                  }),
                ],
              },
              y,
            ),
          ),
          f.jsx("input", {
            type: "text",
            className:
              "min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            placeholder: i.length === 0 ? o : "",
            value: c,
            onChange: (y) => d(y.target.value),
            onKeyDown: h,
          }),
        ],
      }),
      f.jsx("p", {
        className: "mt-1 text-xs text-muted-foreground",
        children: "Enter drücken zum Hinzufügen",
      }),
    ],
  });
}
function TN() {
  const [a, i] = b.useState("loading"),
    [s, o] = b.useState("idle"),
    [c, d] = b.useState(""),
    [h, v] = b.useState({
      anrede: "sie",
      sprachstil: [],
      emailLength: "mittlerer-umfang",
      signature: "",
      typicalPhrases: [],
      industryJargon: [],
      greeting: "",
      closing: "",
    }),
    [y, g] = b.useState(null);
  b.useEffect(() => {
    async function N() {
      try {
        const [z, A] = await Promise.all([
          fetch("/api/tone-profile"),
          fetch("/api/onboarding/tenant"),
        ]);
        if (!z.ok) {
          i("error");
          return;
        }
        const E = await z.json(),
          _ = A.ok ? await A.json() : null,
          C = E.data,
          X = _?.data?.email_signature ?? "";
        (g(C), v(jN(C, X)), i("loaded"));
      } catch {
        i("error");
      }
    }
    N();
  }, []);
  const S = b.useCallback(async () => {
    if (!y) return;
    (o("saving"), d(""));
    const N = new Date().toISOString(),
      z = {
        ...y,
        anrede: h.anrede,
        sprachstil: [...h.sprachstil],
        email_length: h.emailLength,
        formality_level: h.anrede === "du" ? "informal" : "formal",
        greeting_style: h.greeting,
        closing_style: h.closing,
        typical_phrases: [...h.typicalPhrases],
        industry_jargon: [...h.industryJargon],
        updated_at: N,
      };
    try {
      const [A, E] = await Promise.all([
        fetch("/api/tone-profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(z),
        }),
        fetch("/api/onboarding/update-signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email_signature: h.signature }),
        }),
      ]);
      if (!A.ok || !E.ok) {
        const _ = A.ok ? await E.json() : await A.json();
        (o("error"), d(_.error ?? "Speichern fehlgeschlagen"));
        return;
      }
      (g(z), o("saved"), setTimeout(() => o("idle"), 2e3));
    } catch {
      (o("error"), d("Netzwerkfehler — Server nicht erreichbar"));
    }
  }, [y, h]);
  function p(N) {
    v((z) => {
      const A = z.sprachstil;
      return A.includes(N)
        ? { ...z, sprachstil: A.filter((_) => _ !== N) }
        : A.length >= 3
          ? z
          : { ...z, sprachstil: [...A, N] };
    });
  }
  return a === "loading"
    ? f.jsx("div", {
        className:
          "flex items-center justify-center rounded-lg border bg-background py-16",
        children: f.jsx(gt, {
          className: "size-6 animate-spin text-muted-foreground",
        }),
      })
    : a === "error"
      ? f.jsx("div", {
          className:
            "rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700",
          children:
            "Tonprofil konnte nicht geladen werden. Bitte versuchen Sie es erneut.",
        })
      : f.jsxs("div", {
          className: "space-y-6 rounded-lg border bg-background p-6",
          children: [
            f.jsxs("div", {
              children: [
                f.jsx("label", {
                  className: "mb-1.5 block text-sm font-medium text-foreground",
                  children: "Anrede",
                }),
                f.jsx("div", {
                  className: "flex gap-2",
                  children: ["sie", "du"].map((N) =>
                    f.jsx(
                      "button",
                      {
                        type: "button",
                        className: `cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors ${h.anrede === N ? "border-foreground bg-foreground text-background" : "border-input bg-background text-foreground hover:bg-muted"}`,
                        onClick: () => v((z) => ({ ...z, anrede: N })),
                        children: N === "sie" ? "Sie" : "Du",
                      },
                      N,
                    ),
                  ),
                }),
              ],
            }),
            f.jsxs("div", {
              children: [
                f.jsxs("label", {
                  className: "mb-1.5 block text-sm font-medium text-foreground",
                  children: [
                    "Sprachstil",
                    " ",
                    f.jsx("span", {
                      className: "font-normal text-muted-foreground",
                      children: "(max. 3 auswählen)",
                    }),
                  ],
                }),
                f.jsx("div", {
                  className: "flex flex-wrap gap-2",
                  children: NN.map((N) => {
                    const z = h.sprachstil.includes(N.value),
                      A = !z && h.sprachstil.length >= 3;
                    return f.jsx(
                      "button",
                      {
                        type: "button",
                        disabled: A,
                        className: `cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors ${z ? "border-foreground bg-foreground text-background" : A ? "cursor-not-allowed border-input bg-muted/50 text-muted-foreground" : "border-input bg-background text-foreground hover:bg-muted"}`,
                        onClick: () => p(N.value),
                        children: N.label,
                      },
                      N.value,
                    );
                  }),
                }),
              ],
            }),
            f.jsxs("div", {
              children: [
                f.jsx("label", {
                  className: "mb-1.5 block text-sm font-medium text-foreground",
                  children: "E-Mail-Länge",
                }),
                f.jsx("select", {
                  className:
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground",
                  value: h.emailLength,
                  onChange: (N) =>
                    v((z) => ({ ...z, emailLength: N.target.value })),
                  children: _N.map((N) =>
                    f.jsx(
                      "option",
                      { value: N.value, children: N.label },
                      N.value,
                    ),
                  ),
                }),
              ],
            }),
            f.jsxs("div", {
              className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
              children: [
                f.jsxs("div", {
                  children: [
                    f.jsx("label", {
                      className:
                        "mb-1.5 block text-sm font-medium text-foreground",
                      children: "Begrüßung",
                    }),
                    f.jsx("input", {
                      type: "text",
                      className:
                        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      placeholder: "z.B. Sehr geehrte Damen und Herren",
                      value: h.greeting,
                      onChange: (N) =>
                        v((z) => ({ ...z, greeting: N.target.value })),
                    }),
                  ],
                }),
                f.jsxs("div", {
                  children: [
                    f.jsx("label", {
                      className:
                        "mb-1.5 block text-sm font-medium text-foreground",
                      children: "Abschluss",
                    }),
                    f.jsx("input", {
                      type: "text",
                      className:
                        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                      placeholder: "z.B. Mit freundlichen Grüßen",
                      value: h.closing,
                      onChange: (N) =>
                        v((z) => ({ ...z, closing: N.target.value })),
                    }),
                  ],
                }),
              ],
            }),
            f.jsxs("div", {
              children: [
                f.jsx("label", {
                  className: "mb-1.5 block text-sm font-medium text-foreground",
                  children: "E-Mail-Signatur",
                }),
                f.jsx(Xs, {
                  className: "min-h-[100px] resize-y bg-background text-sm",
                  placeholder: "Ihre E-Mail-Signatur...",
                  value: h.signature,
                  onChange: (N) =>
                    v((z) => ({ ...z, signature: N.target.value })),
                }),
              ],
            }),
            f.jsx(Ig, {
              label: "Typische Ausdrücke",
              tags: h.typicalPhrases,
              onChange: (N) => v((z) => ({ ...z, typicalPhrases: N })),
              placeholder: "z.B. Gerne helfen wir Ihnen weiter",
            }),
            f.jsx(Ig, {
              label: "Fachbegriffe",
              tags: h.industryJargon,
              onChange: (N) => v((z) => ({ ...z, industryJargon: N })),
              placeholder: "z.B. SLA, Onboarding",
            }),
            s === "error" &&
              f.jsxs("div", {
                className:
                  "flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700",
                children: [f.jsx(d1, { className: "size-4 shrink-0" }), c],
              }),
            f.jsxs(qe, {
              className: "w-full cursor-pointer",
              disabled: s === "saving",
              onClick: S,
              children: [
                s === "saving" &&
                  f.jsx(gt, { className: "size-4 animate-spin" }),
                s === "saved" && f.jsx(o1, { className: "size-4" }),
                s !== "saving" &&
                  s !== "saved" &&
                  f.jsx(R1, { className: "size-4" }),
                s === "saved" ? "Gespeichert" : "Änderungen speichern",
              ],
            }),
          ],
        });
}
function CN() {
  const a = ei((A) => A.isVerified),
    [i, s] = b.useState([]),
    [o, c] = b.useState("loading"),
    [d, h] = b.useState(new Set()),
    [v, y] = b.useState(null),
    [g, S] = b.useState(!1),
    p = b.useCallback(async () => {
      try {
        const A = await fetch("/api/onboarding/tenants");
        if (!A.ok) {
          c("error");
          return;
        }
        const E = await A.json();
        E.success ? (s(E.data), c("loaded")) : c("error");
      } catch {
        c("error");
      }
    }, []);
  b.useEffect(() => {
    p();
  }, [p]);
  async function N(A, E) {
    h((_) => {
      const C = new Set(_);
      return (C.add(A), C);
    });
    try {
      (
        await fetch("/api/onboarding/tenant-toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tenant_id: A, active: E === 0 }),
        })
      ).ok &&
        s((C) =>
          C.map((X) =>
            X.tenant_id === A ? { ...X, active: E === 0 ? 1 : 0 } : X,
          ),
        );
    } catch {
    } finally {
      h((_) => {
        const C = new Set(_);
        return (C.delete(A), C);
      });
    }
  }
  async function z() {
    if (v) {
      S(!0);
      try {
        (
          await fetch("/api/onboarding/tenant-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenant_id: v.tenant_id }),
          })
        ).ok && s((E) => E.filter((_) => _.tenant_id !== v.tenant_id));
      } catch {
      } finally {
        (S(!1), y(null));
      }
    }
  }
  return f.jsxs("div", {
    className: "flex min-h-screen flex-col bg-[#f8f9fa]",
    children: [
      f.jsx("header", {
        className: "border-b bg-background px-6 py-4",
        children: f.jsxs("div", {
          className: "mx-auto flex max-w-3xl items-center gap-3",
          children: [
            f.jsx(Il, {
              to: "/",
              className:
                "cursor-pointer rounded-md p-1 text-muted-foreground hover:text-foreground",
              children: f.jsx(i1, { className: "size-5" }),
            }),
            f.jsx("h1", {
              className: "text-lg font-semibold",
              children: "Einstellungen",
            }),
          ],
        }),
      }),
      f.jsx("main", {
        className: "flex flex-1 flex-col items-center px-4 py-8",
        children: f.jsxs("div", {
          className: "w-full max-w-3xl space-y-6",
          children: [
            f.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                f.jsxs("div", {
                  children: [
                    f.jsx("h2", {
                      className: "text-base font-semibold text-foreground",
                      children: "Verbundene E-Mail-Konten",
                    }),
                    f.jsx("p", {
                      className: "text-sm text-muted-foreground",
                      children:
                        "Verwalten Sie Ihre E-Mail-Konten und deren Status.",
                    }),
                  ],
                }),
                f.jsx(Il, {
                  to: "/onboarding",
                  children: f.jsxs(qe, {
                    size: "sm",
                    className: "cursor-pointer gap-1.5",
                    children: [
                      f.jsx(Sg, { className: "size-4" }),
                      "Neues Konto",
                    ],
                  }),
                }),
              ],
            }),
            o === "loading" &&
              f.jsx("div", {
                className:
                  "flex items-center justify-center rounded-lg border bg-background py-16",
                children: f.jsx(gt, {
                  className: "size-6 animate-spin text-muted-foreground",
                }),
              }),
            o === "error" &&
              f.jsx("div", {
                className:
                  "rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700",
                children:
                  "Konten konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
              }),
            o === "loaded" &&
              i.length === 0 &&
              f.jsxs("div", {
                className:
                  "flex flex-col items-center gap-4 rounded-lg border bg-background py-16",
                children: [
                  f.jsx(_1, { className: "size-10 text-muted-foreground" }),
                  f.jsxs("div", {
                    className: "text-center",
                    children: [
                      f.jsx("p", {
                        className: "text-sm font-medium text-foreground",
                        children: "Noch keine E-Mail-Konten verbunden.",
                      }),
                      f.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children:
                          "Verknüpfen Sie Ihr erstes E-Mail-Konto, um loszulegen.",
                      }),
                    ],
                  }),
                  f.jsx(Il, {
                    to: "/onboarding",
                    children: f.jsxs(qe, {
                      className: "cursor-pointer gap-1.5",
                      children: [
                        f.jsx(Sg, { className: "size-4" }),
                        "E-Mail-Konto verknüpfen",
                      ],
                    }),
                  }),
                ],
              }),
            o === "loaded" &&
              i.length > 0 &&
              f.jsx("div", {
                className: "divide-y rounded-lg border bg-background",
                children: i.map((A) =>
                  f.jsxs(
                    "div",
                    {
                      className: "flex items-center justify-between px-5 py-4",
                      children: [
                        f.jsxs("div", {
                          className: "flex items-center gap-3 min-w-0",
                          children: [
                            f.jsx("span", {
                              className: `size-2.5 shrink-0 rounded-full ${A.active === 1 ? "bg-green-500" : "bg-gray-300"}`,
                              title: A.active === 1 ? "Aktiv" : "Inaktiv",
                            }),
                            f.jsxs("div", {
                              className: "min-w-0",
                              children: [
                                f.jsx("p", {
                                  className:
                                    "truncate text-sm font-medium text-foreground",
                                  children: A.imap_user ?? A.tenant_id,
                                }),
                                f.jsxs("p", {
                                  className: "text-xs text-muted-foreground",
                                  children: [
                                    "Erstellt am",
                                    " ",
                                    new Date(A.created_at).toLocaleDateString(
                                      "de-DE",
                                      {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      },
                                    ),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        f.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            f.jsx("button", {
                              type: "button",
                              role: "switch",
                              "aria-checked": A.active === 1,
                              "aria-label":
                                A.active === 1 ? "Deaktivieren" : "Aktivieren",
                              disabled: d.has(A.tenant_id),
                              onClick: () => N(A.tenant_id, A.active),
                              className: `relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${A.active === 1 ? "bg-green-500" : "bg-gray-200"}`,
                              children: f.jsx("span", {
                                className: `pointer-events-none block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${A.active === 1 ? "translate-x-5" : "translate-x-0"}`,
                              }),
                            }),
                            f.jsx(qe, {
                              variant: "ghost",
                              size: "icon-sm",
                              className:
                                "cursor-pointer text-muted-foreground hover:text-destructive",
                              onClick: () => y(A),
                              children: f.jsx(Qc, { className: "size-4" }),
                            }),
                          ],
                        }),
                      ],
                    },
                    A.tenant_id,
                  ),
                ),
              }),
            a &&
              f.jsxs("div", {
                className: "pt-4 border-t",
                children: [
                  f.jsxs("div", {
                    className: "mb-4",
                    children: [
                      f.jsx("h2", {
                        className: "text-base font-semibold text-foreground",
                        children: "Tonprofil & Signatur",
                      }),
                      f.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children:
                          "Passen Sie Ihren Schreibstil und Ihre E-Mail-Signatur an.",
                      }),
                    ],
                  }),
                  f.jsx(TN, {}),
                ],
              }),
          ],
        }),
      }),
      f.jsx(rf, {
        open: v !== null,
        onOpenChange: (A) => {
          A || y(null);
        },
        children: f.jsxs(sf, {
          children: [
            f.jsxs(of, {
              children: [
                f.jsx(cf, { children: "Konto entfernen" }),
                f.jsx(ff, {
                  children:
                    "Möchten Sie dieses Konto wirklich entfernen? Alle E-Mails und das Tonprofil werden unwiderruflich gelöscht.",
                }),
              ],
            }),
            v &&
              f.jsx("p", {
                className: "text-sm font-medium text-foreground",
                children: v.imap_user ?? v.tenant_id,
              }),
            f.jsxs(uf, {
              children: [
                f.jsx(qe, {
                  variant: "outline",
                  className: "cursor-pointer",
                  disabled: g,
                  onClick: () => y(null),
                  children: "Abbrechen",
                }),
                f.jsxs(qe, {
                  variant: "destructive",
                  className: "cursor-pointer",
                  disabled: g,
                  onClick: z,
                  children: [
                    g && f.jsx(gt, { className: "size-4 animate-spin" }),
                    "Endgültig löschen",
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
E0.createRoot(document.getElementById("root")).render(
  f.jsx(b.StrictMode, {
    children: f.jsx(Vx, {
      children: f.jsxs(yx, {
        children: [
          f.jsx(ks, { path: "/", element: f.jsx(EN, {}) }),
          f.jsx(ks, { path: "/login", element: f.jsx(wN, {}) }),
          f.jsx(ks, { path: "/settings", element: f.jsx(CN, {}) }),
        ],
      }),
    }),
  }),
);
