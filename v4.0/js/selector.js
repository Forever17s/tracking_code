(function(window, undefined) {
    var i, cachedruns, Expr, getText, isXML, compile, hasDuplicate, outermostContext, setDocument, document, docElem, documentIsXML, rbuggyQSA, rbuggyMatches, matches, contains, sortOrder, expando = "py_s" + -new Date(), preferredDoc = window.document, support = {}, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, arr = [], pop = arr.pop, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function(elem) {
        var i = 0, len = this.length;
        for (;i < len; i++) {
            if (this[i] === elem) {
                return i;
            }
        }
        return -1;
    }, whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), operators = "([*^$|!~]?=)", attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace + "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace(3, 8) + ")*)|.*)\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
        ID:new RegExp("^#(" + characterEncoding + ")"),
        CLASS:new RegExp("^\\.(" + characterEncoding + ")"),
        NAME:new RegExp("^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]"),
        TAG:new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
        ATTR:new RegExp("^" + attributes),
        PSEUDO:new RegExp("^" + pseudos),
        CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
        needsContext:new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
    }, rsibling = /[\x20\t\r\n\f]*[+~]/, rnative = /^[^{]+\{\s*\[native code/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rescape = /'|\\/g, rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g, funescape = function(_, escaped) {
        var high = "0x" + escaped - 65536;
        return high !== high ? escaped :high < 0 ? String.fromCharCode(high + 65536) :String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
    };
    try {
        slice.call(preferredDoc.documentElement.childNodes, 0)[0].nodeType;
    } catch (e) {
        slice = function(i) {
            var elem, results = [];
            while (elem = this[i++]) {
                results.push(elem);
            }
            return results;
        };
    }
    function isNative(fn) {
        return rnative.test(fn + "");
    }
    function createCache() {
        var cache, keys = [];
        return cache = function(key, value) {
            if (keys.push(key += " ") > Expr.cacheLength) {
                delete cache[keys.shift()];
            }
            return cache[key] = value;
        };
    }
    function markFunction(fn) {
        fn[expando] = true;
        return fn;
    }
    function assert(fn) {
        var div = document.createElement("div");
        try {
            return fn(div);
        } catch (e) {
            return false;
        } finally {
            div = null;
        }
    }
    function py_s(selector, context, results, seed) {
        var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
        if ((context ? context.ownerDocument || context :preferredDoc) !== document) {
            setDocument(context);
        }
        context = context || document;
        results = results || [];
        if (!selector || typeof selector !== "string") {
            return results;
        }
        if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
            return [];
        }
        if (!documentIsXML && !seed) {
            if (match = rquickExpr.exec(selector)) {
                if (m = match[1]) {
                    if (nodeType === 9) {
                        elem = context.getElementById(m);
                        if (elem && elem.parentNode) {
                            if (elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        } else {
                            return results;
                        }
                    } else {
                        if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                            results.push(elem);
                            return results;
                        }
                    }
                } else if (match[2]) {
                    push.apply(results, slice.call(context.getElementsByTagName(selector), 0));
                    return results;
                } else if ((m = match[3]) && support.getByClassName && context.getElementsByClassName) {
                    push.apply(results, slice.call(context.getElementsByClassName(m), 0));
                    return results;
                }
            }
            if (support.qsa && !rbuggyQSA.test(selector)) {
                old = true;
                nid = expando;
                newContext = context;
                newSelector = nodeType === 9 && selector;
                if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                    groups = tokenize(selector);
                    if (old = context.getAttribute("id")) {
                        nid = old.replace(rescape, "\\$&");
                    } else {
                        context.setAttribute("id", nid);
                    }
                    nid = "[id='" + nid + "'] ";
                    i = groups.length;
                    while (i--) {
                        groups[i] = nid + toSelector(groups[i]);
                    }
                    newContext = rsibling.test(selector) && context.parentNode || context;
                    newSelector = groups.join(",");
                }
                if (newSelector) {
                    try {
                        push.apply(results, slice.call(newContext.querySelectorAll(newSelector), 0));
                        return results;
                    } catch (qsaError) {} finally {
                        if (!old) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }
        }
        return select(selector.replace(rtrim, "$1"), context, results, seed);
    }
    isXML = py_s.isXML = function(elem) {
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" :false;
    };
    setDocument = py_s.setDocument = function(node) {
        var doc = node ? node.ownerDocument || node :preferredDoc;
        if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
            return document;
        }
        document = doc;
        docElem = doc.documentElement;
        documentIsXML = isXML(doc);
        support.tagNameNoComments = assert(function(div) {
            div.appendChild(doc.createComment(""));
            return !div.getElementsByTagName("*").length;
        });
        support.attributes = assert(function(div) {
            div.innerHTML = "<select></select>";
            var type = typeof div.lastChild.getAttribute("multiple");
            return type !== "boolean" && type !== "string";
        });
        support.getByClassName = assert(function(div) {
            div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
            if (!div.getElementsByClassName || !div.getElementsByClassName("e").length) {
                return false;
            }
            div.lastChild.className = "e";
            return div.getElementsByClassName("e").length === 2;
        });
        support.getByName = assert(function(div) {
            div.id = expando + 0;
            div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
            docElem.insertBefore(div, docElem.firstChild);
            var pass = doc.getElementsByName && doc.getElementsByName(expando).length === 2 + doc.getElementsByName(expando + 0).length;
            support.getIdNotName = !doc.getElementById(expando);
            docElem.removeChild(div);
            return pass;
        });
        Expr.attrHandle = assert(function(div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild && typeof div.firstChild.getAttribute !== strundefined && div.firstChild.getAttribute("href") === "#";
        }) ? {} :{
            href:function(elem) {
                return elem.getAttribute("href", 2);
            },
            type:function(elem) {
                return elem.getAttribute("type");
            }
        };
        if (support.getIdNotName) {
            Expr.find["ID"] = function(id, context) {
                if (typeof context.getElementById !== strundefined && !documentIsXML) {
                    var m = context.getElementById(id);
                    return m && m.parentNode ? [ m ] :[];
                }
            };
            Expr.filter["ID"] = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    return elem.getAttribute("id") === attrId;
                };
            };
        } else {
            Expr.find["ID"] = function(id, context) {
                if (typeof context.getElementById !== strundefined && !documentIsXML) {
                    var m = context.getElementById(id);
                    return m ? m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ? [ m ] :undefined :[];
                }
            };
            Expr.filter["ID"] = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            };
        }
        Expr.find["TAG"] = support.tagNameNoComments ? function(tag, context) {
            if (typeof context.getElementsByTagName !== strundefined) {
                return context.getElementsByTagName(tag);
            }
        } :function(tag, context) {
            var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
            if (tag === "*") {
                while (elem = results[i++]) {
                    if (elem.nodeType === 1) {
                        tmp.push(elem);
                    }
                }
                return tmp;
            }
            return results;
        };
        Expr.find["NAME"] = support.getByName && function(tag, context) {
            if (typeof context.getElementsByName !== strundefined) {
                return context.getElementsByName(name);
            }
        };
        Expr.find["CLASS"] = support.getByClassName && function(className, context) {
            if (typeof context.getElementsByClassName !== strundefined && !documentIsXML) {
                return context.getElementsByClassName(className);
            }
        };
        rbuggyMatches = [];
        rbuggyQSA = [ ":focus" ];
        if (support.qsa = isNative(doc.querySelectorAll)) {
            assert(function(div) {
                div.innerHTML = "<select><option selected=''></option></select>";
                if (!div.querySelectorAll("[selected]").length) {
                    rbuggyQSA.push("\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)");
                }
                if (!div.querySelectorAll(":checked").length) {
                    rbuggyQSA.push(":checked");
                }
            });
            assert(function(div) {
                div.innerHTML = "<input type='hidden' i=''/>";
                if (div.querySelectorAll("[i^='']").length) {
                    rbuggyQSA.push("[*^$]=" + whitespace + "*(?:\"\"|'')");
                }
                if (!div.querySelectorAll(":enabled").length) {
                    rbuggyQSA.push(":enabled", ":disabled");
                }
                div.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
            });
        }
        if (support.matchesSelector = isNative(matches = docElem.matchesSelector || docElem.mozMatchesSelector || docElem.webkitMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
            assert(function(div) {
                support.disconnectedMatch = matches.call(div, "div");
                matches.call(div, "[s!='']:x");
                rbuggyMatches.push("!=", pseudos);
            });
        }
        rbuggyQSA = new RegExp(rbuggyQSA.join("|"));
        rbuggyMatches = new RegExp(rbuggyMatches.join("|"));
        contains = isNative(docElem.contains) || docElem.compareDocumentPosition ? function(a, b) {
            var adown = a.nodeType === 9 ? a.documentElement :a, bup = b && b.parentNode;
            return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) :a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        } :function(a, b) {
            if (b) {
                while (b = b.parentNode) {
                    if (b === a) {
                        return true;
                    }
                }
            }
            return false;
        };
        sortOrder = docElem.compareDocumentPosition ? function(a, b) {
            var compare;
            if (a === b) {
                hasDuplicate = true;
                return 0;
            }
            if (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition(b)) {
                if (compare & 1 || a.parentNode && a.parentNode.nodeType === 11) {
                    if (a === doc || contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === doc || contains(preferredDoc, b)) {
                        return 1;
                    }
                    return 0;
                }
                return compare & 4 ? -1 :1;
            }
            return a.compareDocumentPosition ? -1 :1;
        } :function(a, b) {
            var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
            if (a === b) {
                hasDuplicate = true;
                return 0;
            } else if (!aup || !bup) {
                return a === doc ? -1 :b === doc ? 1 :aup ? -1 :bup ? 1 :0;
            } else if (aup === bup) {
                return siblingCheck(a, b);
            }
            cur = a;
            while (cur = cur.parentNode) {
                ap.unshift(cur);
            }
            cur = b;
            while (cur = cur.parentNode) {
                bp.unshift(cur);
            }
            while (ap[i] === bp[i]) {
                i++;
            }
            return i ? siblingCheck(ap[i], bp[i]) :ap[i] === preferredDoc ? -1 :bp[i] === preferredDoc ? 1 :0;
        };
        hasDuplicate = false;
        [ 0, 0 ].sort(sortOrder);
        support.detectDuplicates = hasDuplicate;
        return document;
    };
    py_s.matches = function(expr, elements) {
        return py_s(expr, null, null, elements);
    };
    py_s.matchesSelector = function(elem, expr) {
        if ((elem.ownerDocument || elem) !== document) {
            setDocument(elem);
        }
        expr = expr.replace(rattributeQuotes, "='$1']");
        if (support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr)) {
            try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                    return ret;
                }
            } catch (e) {}
        }
        return py_s(expr, document, null, [ elem ]).length > 0;
    };
    py_s.contains = function(context, elem) {
        if ((context.ownerDocument || context) !== document) {
            setDocument(context);
        }
        return contains(context, elem);
    };
    py_s.attr = function(elem, name) {
        var val;
        if ((elem.ownerDocument || elem) !== document) {
            setDocument(elem);
        }
        if (!documentIsXML) {
            name = name.toLowerCase();
        }
        if (val = Expr.attrHandle[name]) {
            return val(elem);
        }
        if (documentIsXML || support.attributes) {
            return elem.getAttribute(name);
        }
        return ((val = elem.getAttributeNode(name)) || elem.getAttribute(name)) && elem[name] === true ? name :val && val.specified ? val.value :null;
    };
    py_s.error = function(msg) {
        throw new Error("Syntax error, unrecognized expression: " + msg);
    };
    py_s.uniqueSort = function(results) {
        var elem, duplicates = [], i = 1, j = 0;
        hasDuplicate = !support.detectDuplicates;
        results.sort(sortOrder);
        if (hasDuplicate) {
            for (;elem = results[i]; i++) {
                if (elem === results[i - 1]) {
                    j = duplicates.push(i);
                }
            }
            while (j--) {
                results.splice(duplicates[j], 1);
            }
        }
        return results;
    };
    function siblingCheck(a, b) {
        var cur = b && a, diff = cur && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
        if (diff) {
            return diff;
        }
        if (cur) {
            while (cur = cur.nextSibling) {
                if (cur === b) {
                    return -1;
                }
            }
        }
        return a ? 1 :-1;
    }
    function createInputPseudo(type) {
        return function(elem) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }
    function createButtonPseudo(type) {
        return function(elem) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }
    function createPositionalPseudo(fn) {
        return markFunction(function(argument) {
            argument = +argument;
            return markFunction(function(seed, matches) {
                var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
                while (i--) {
                    if (seed[j = matchIndexes[i]]) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }
    getText = py_s.getText = function(elem) {
        var node, ret = "", i = 0, nodeType = elem.nodeType;
        if (!nodeType) {
            for (;node = elem[i]; i++) {
                ret += getText(node);
            }
        } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
            if (typeof elem.textContent === "string") {
                return elem.textContent;
            } else {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    ret += getText(elem);
                }
            }
        } else if (nodeType === 3 || nodeType === 4) {
            return elem.nodeValue;
        }
        return ret;
    };
    Expr = py_s.selectors = {
        cacheLength:50,
        createPseudo:markFunction,
        match:matchExpr,
        find:{},
        relative:{
            ">":{
                dir:"parentNode",
                first:true
            },
            " ":{
                dir:"parentNode"
            },
            "+":{
                dir:"previousSibling",
                first:true
            },
            "~":{
                dir:"previousSibling"
            }
        },
        preFilter:{
            ATTR:function(match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                    match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
            },
            CHILD:function(match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                    if (!match[3]) {
                        py_s.error(match[0]);
                    }
                    match[4] = +(match[4] ? match[5] + (match[6] || 1) :2 * (match[3] === "even" || match[3] === "odd"));
                    match[5] = +(match[7] + match[8] || match[3] === "odd");
                } else if (match[3]) {
                    py_s.error(match[0]);
                }
                return match;
            },
            PSEUDO:function(match) {
                var excess, unquoted = !match[5] && match[2];
                if (matchExpr["CHILD"].test(match[0])) {
                    return null;
                }
                if (match[4]) {
                    match[2] = match[4];
                } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                    match[0] = match[0].slice(0, excess);
                    match[2] = unquoted.slice(0, excess);
                }
                return match.slice(0, 3);
            }
        },
        filter:{
            TAG:function(nodeName) {
                if (nodeName === "*") {
                    return function() {
                        return true;
                    };
                }
                nodeName = nodeName.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                    return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                };
            },
            CLASS:function(className) {
                var pattern = classCache[className + " "];
                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                    return pattern.test(elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                });
            },
            ATTR:function(name, operator, check) {
                return function(elem) {
                    var result = py_s.attr(elem, name);
                    if (result == null) {
                        return operator === "!=";
                    }
                    if (!operator) {
                        return true;
                    }
                    result += "";
                    return operator === "=" ? result === check :operator === "!=" ? result !== check :operator === "^=" ? check && result.indexOf(check) === 0 :operator === "*=" ? check && result.indexOf(check) > -1 :operator === "$=" ? check && result.slice(-check.length) === check :operator === "~=" ? (" " + result + " ").indexOf(check) > -1 :operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :false;
                };
            },
            CHILD:function(type, what, argument, first, last) {
                var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ? function(elem) {
                    return !!elem.parentNode;
                } :function(elem, context, xml) {
                    var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" :"previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                    if (parent) {
                        if (simple) {
                            while (dir) {
                                node = elem;
                                while (node = node[dir]) {
                                    if (ofType ? node.nodeName.toLowerCase() === name :node.nodeType === 1) {
                                        return false;
                                    }
                                }
                                start = dir = type === "only" && !start && "nextSibling";
                            }
                            return true;
                        }
                        start = [ forward ? parent.firstChild :parent.lastChild ];
                        if (forward && useCache) {
                            outerCache = parent[expando] || (parent[expando] = {});
                            cache = outerCache[type] || [];
                            nodeIndex = cache[0] === dirruns && cache[1];
                            diff = cache[0] === dirruns && cache[2];
                            node = nodeIndex && parent.childNodes[nodeIndex];
                            while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                                if (node.nodeType === 1 && ++diff && node === elem) {
                                    outerCache[type] = [ dirruns, nodeIndex, diff ];
                                    break;
                                }
                            }
                        } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                            diff = cache[1];
                        } else {
                            while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                                if ((ofType ? node.nodeName.toLowerCase() === name :node.nodeType === 1) && ++diff) {
                                    if (useCache) {
                                        (node[expando] || (node[expando] = {}))[type] = [ dirruns, diff ];
                                    }
                                    if (node === elem) {
                                        break;
                                    }
                                }
                            }
                        }
                        diff -= last;
                        return diff === first || diff % first === 0 && diff / first >= 0;
                    }
                };
            },
            PSEUDO:function(pseudo, argument) {
                var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || py_s.error("unsupported pseudo: " + pseudo);
                if (fn[expando]) {
                    return fn(argument);
                }
                if (fn.length > 1) {
                    args = [ pseudo, pseudo, "", argument ];
                    return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                        var idx, matched = fn(seed, argument), i = matched.length;
                        while (i--) {
                            idx = indexOf.call(seed, matched[i]);
                            seed[idx] = !(matches[idx] = matched[i]);
                        }
                    }) :function(elem) {
                        return fn(elem, 0, args);
                    };
                }
                return fn;
            }
        },
        pseudos:{
            not:markFunction(function(selector) {
                var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                    var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
                    while (i--) {
                        if (elem = unmatched[i]) {
                            seed[i] = !(matches[i] = elem);
                        }
                    }
                }) :function(elem, context, xml) {
                    input[0] = elem;
                    matcher(input, null, xml, results);
                    return !results.pop();
                };
            }),
            has:markFunction(function(selector) {
                return function(elem) {
                    return py_s(selector, elem).length > 0;
                };
            }),
            contains:markFunction(function(text) {
                return function(elem) {
                    return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                };
            }),
            lang:markFunction(function(lang) {
                if (!ridentifier.test(lang || "")) {
                    py_s.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                    var elemLang;
                    do {
                        if (elemLang = documentIsXML ? elem.getAttribute("xml:lang") || elem.getAttribute("lang") :elem.lang) {
                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                        }
                    } while ((elem = elem.parentNode) && elem.nodeType === 1);
                    return false;
                };
            }),
            target:function(elem) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice(1) === elem.id;
            },
            root:function(elem) {
                return elem === docElem;
            },
            focus:function(elem) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
            },
            enabled:function(elem) {
                return elem.disabled === false;
            },
            disabled:function(elem) {
                return elem.disabled === true;
            },
            checked:function(elem) {
                var nodeName = elem.nodeName.toLowerCase();
                return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
            },
            selected:function(elem) {
                if (elem.parentNode) {
                    elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
            },
            empty:function(elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                    if (elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4) {
                        return false;
                    }
                }
                return true;
            },
            parent:function(elem) {
                return !Expr.pseudos["empty"](elem);
            },
            header:function(elem) {
                return rheader.test(elem.nodeName);
            },
            input:function(elem) {
                return rinputs.test(elem.nodeName);
            },
            button:function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
            },
            text:function(elem) {
                var attr;
                return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type);
            },
            first:createPositionalPseudo(function() {
                return [ 0 ];
            }),
            last:createPositionalPseudo(function(matchIndexes, length) {
                return [ length - 1 ];
            }),
            eq:createPositionalPseudo(function(matchIndexes, length, argument) {
                return [ argument < 0 ? argument + length :argument ];
            }),
            even:createPositionalPseudo(function(matchIndexes, length) {
                var i = 0;
                for (;i < length; i += 2) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),
            odd:createPositionalPseudo(function(matchIndexes, length) {
                var i = 1;
                for (;i < length; i += 2) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),
            lt:createPositionalPseudo(function(matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length :argument;
                for (;--i >= 0; ) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            }),
            gt:createPositionalPseudo(function(matchIndexes, length, argument) {
                var i = argument < 0 ? argument + length :argument;
                for (;++i < length; ) {
                    matchIndexes.push(i);
                }
                return matchIndexes;
            })
        }
    };
    for (i in {
        radio:true,
        checkbox:true,
        file:true,
        password:true,
        image:true
    }) {
        Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {
        submit:true,
        reset:true
    }) {
        Expr.pseudos[i] = createButtonPseudo(i);
    }
    function tokenize(selector, parseOnly) {
        var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
        if (cached) {
            return parseOnly ? 0 :cached.slice(0);
        }
        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;
        while (soFar) {
            if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                    soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
            }
            matched = false;
            if (match = rcombinators.exec(soFar)) {
                matched = match.shift();
                tokens.push({
                    value:matched,
                    type:match[0].replace(rtrim, " ")
                });
                soFar = soFar.slice(matched.length);
            }
            for (type in Expr.filter) {
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                    matched = match.shift();
                    tokens.push({
                        value:matched,
                        type:type,
                        matches:match
                    });
                    soFar = soFar.slice(matched.length);
                }
            }
            if (!matched) {
                break;
            }
        }
        return parseOnly ? soFar.length :soFar ? py_s.error(selector) :tokenCache(selector, groups).slice(0);
    }
    function toSelector(tokens) {
        var i = 0, len = tokens.length, selector = "";
        for (;i < len; i++) {
            selector += tokens[i].value;
        }
        return selector;
    }
    function addCombinator(matcher, combinator, base) {
        var dir = combinator.dir, checkNonElements = base && dir === "parentNode", doneName = done++;
        return combinator.first ? function(elem, context, xml) {
            while (elem = elem[dir]) {
                if (elem.nodeType === 1 || checkNonElements) {
                    return matcher(elem, context, xml);
                }
            }
        } :function(elem, context, xml) {
            var data, cache, outerCache, dirkey = dirruns + " " + doneName;
            if (xml) {
                while (elem = elem[dir]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        if (matcher(elem, context, xml)) {
                            return true;
                        }
                    }
                }
            } else {
                while (elem = elem[dir]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        outerCache = elem[expando] || (elem[expando] = {});
                        if ((cache = outerCache[dir]) && cache[0] === dirkey) {
                            if ((data = cache[1]) === true || data === cachedruns) {
                                return data === true;
                            }
                        } else {
                            cache = outerCache[dir] = [ dirkey ];
                            cache[1] = matcher(elem, context, xml) || cachedruns;
                            if (cache[1] === true) {
                                return true;
                            }
                        }
                    }
                }
            }
        };
    }
    function elementMatcher(matchers) {
        return matchers.length > 1 ? function(elem, context, xml) {
            var i = matchers.length;
            while (i--) {
                if (!matchers[i](elem, context, xml)) {
                    return false;
                }
            }
            return true;
        } :matchers[0];
    }
    function condense(unmatched, map, filter, context, xml) {
        var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
        for (;i < len; i++) {
            if (elem = unmatched[i]) {
                if (!filter || filter(elem, context, xml)) {
                    newUnmatched.push(elem);
                    if (mapped) {
                        map.push(i);
                    }
                }
            }
        }
        return newUnmatched;
    }
    function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
        if (postFilter && !postFilter[expando]) {
            postFilter = setMatcher(postFilter);
        }
        if (postFinder && !postFinder[expando]) {
            postFinder = setMatcher(postFinder, postSelector);
        }
        return markFunction(function(seed, results, context, xml) {
            var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [ context ] :context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) :elems, matcherOut = matcher ? postFinder || (seed ? preFilter :preexisting || postFilter) ? [] :results :matcherIn;
            if (matcher) {
                matcher(matcherIn, matcherOut, context, xml);
            }
            if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);
                i = temp.length;
                while (i--) {
                    if (elem = temp[i]) {
                        matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                    }
                }
            }
            if (seed) {
                if (postFinder || preFilter) {
                    if (postFinder) {
                        temp = [];
                        i = matcherOut.length;
                        while (i--) {
                            if (elem = matcherOut[i]) {
                                temp.push(matcherIn[i] = elem);
                            }
                        }
                        postFinder(null, matcherOut = [], temp, xml);
                    }
                    i = matcherOut.length;
                    while (i--) {
                        if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) :preMap[i]) > -1) {
                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }
            } else {
                matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) :matcherOut);
                if (postFinder) {
                    postFinder(null, results, matcherOut, xml);
                } else {
                    push.apply(results, matcherOut);
                }
            }
        });
    }
    function matcherFromTokens(tokens) {
        var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 :0, matchContext = addCombinator(function(elem) {
            return elem === checkContext;
        }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
            return indexOf.call(checkContext, elem) > -1;
        }, implicitRelative, true), matchers = [ function(elem, context, xml) {
            return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) :matchAnyContext(elem, context, xml));
        } ];
        for (;i < len; i++) {
            if (matcher = Expr.relative[tokens[i].type]) {
                matchers = [ addCombinator(elementMatcher(matchers), matcher) ];
            } else {
                matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                if (matcher[expando]) {
                    j = ++i;
                    for (;j < len; j++) {
                        if (Expr.relative[tokens[j].type]) {
                            break;
                        }
                    }
                    return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1)).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                }
                matchers.push(matcher);
            }
        }
        return elementMatcher(matchers);
    }
    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
        var matcherCachedRuns = 0, bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, expandContext) {
            var elem, j, matcher, setMatched = [], matchedCount = 0, i = "0", unmatched = seed && [], outermost = expandContext != null, contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", expandContext && context.parentNode || context), dirrunsUnique = dirruns += contextBackup == null ? 1 :Math.random() || .1;
            if (outermost) {
                outermostContext = context !== document && context;
                cachedruns = matcherCachedRuns;
            }
            for (;(elem = elems[i]) != null; i++) {
                if (byElement && elem) {
                    j = 0;
                    while (matcher = elementMatchers[j++]) {
                        if (matcher(elem, context, xml)) {
                            results.push(elem);
                            break;
                        }
                    }
                    if (outermost) {
                        dirruns = dirrunsUnique;
                        cachedruns = ++matcherCachedRuns;
                    }
                }
                if (bySet) {
                    if (elem = !matcher && elem) {
                        matchedCount--;
                    }
                    if (seed) {
                        unmatched.push(elem);
                    }
                }
            }
            matchedCount += i;
            if (bySet && i !== matchedCount) {
                j = 0;
                while (matcher = setMatchers[j++]) {
                    matcher(unmatched, setMatched, context, xml);
                }
                if (seed) {
                    if (matchedCount > 0) {
                        while (i--) {
                            if (!(unmatched[i] || setMatched[i])) {
                                setMatched[i] = pop.call(results);
                            }
                        }
                    }
                    setMatched = condense(setMatched);
                }
                push.apply(results, setMatched);
                if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                    py_s.uniqueSort(results);
                }
            }
            if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
            }
            return unmatched;
        };
        return bySet ? markFunction(superMatcher) :superMatcher;
    }
    compile = py_s.compile = function(selector, group) {
        var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
        if (!cached) {
            if (!group) {
                group = tokenize(selector);
            }
            i = group.length;
            while (i--) {
                cached = matcherFromTokens(group[i]);
                if (cached[expando]) {
                    setMatchers.push(cached);
                } else {
                    elementMatchers.push(cached);
                }
            }
            cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
        }
        return cached;
    };
    function multipleContexts(selector, contexts, results) {
        var i = 0, len = contexts.length;
        for (;i < len; i++) {
            py_s(selector, contexts[i], results);
        }
        return results;
    }
    function select(selector, context, results, seed) {
        var i, tokens, token, type, find, match = tokenize(selector);
        if (!seed) {
            if (match.length === 1) {
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && !documentIsXML && Expr.relative[tokens[1].type]) {
                    context = Expr.find["ID"](token.matches[0].replace(runescape, funescape), context)[0];
                    if (!context) {
                        return results;
                    }
                    selector = selector.slice(tokens.shift().value.length);
                }
                i = matchExpr["needsContext"].test(selector) ? 0 :tokens.length;
                while (i--) {
                    token = tokens[i];
                    if (Expr.relative[type = token.type]) {
                        break;
                    }
                    if (find = Expr.find[type]) {
                        if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && context.parentNode || context)) {
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, slice.call(seed, 0));
                                return results;
                            }
                            break;
                        }
                    }
                }
            }
        }
        compile(selector, match)(seed, context, documentIsXML, results, rsibling.test(selector));
        return results;
    }
    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    function setFilters() {}
    Expr.filters = setFilters.prototype = Expr.pseudos;
    Expr.setFilters = new setFilters();
    setDocument();
    if (typeof define === "function" && define.amd) {
        define(function() {
            return py_s;
        });
    } else {
        window.py_s = py_s;
    }
})(window);