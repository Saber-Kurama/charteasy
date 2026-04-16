function wL(e) {
                    const {
                        handlers: t
                    } = e, {
                        editor: i,
                        setEditor: n,
                        setEditorState: r,
                        setEditorInteraction: s
                    } = jS((0, o.k)(e => ({
                        editor: e.editor,
                        setEditor: e.setEditor,
                        setEditorState: e.setEditorState,
                        setEditorInteraction: e.setEditorInteraction
                    }))), {
                        zoom: l,
                        setZoom: c,
                        setEnableUndo: d,
                        setEnableRedo: h
                    } = AL((0, o.k)(e => ({
                        zoom: e.zoom,
                        setZoom: e.setZoom,
                        setEnableUndo: e.setEnableUndo,
                        setEnableRedo: e.setEnableRedo
                    }))), {
                        setEditorBarVisible: p,
                        setDataPanelVisible: u,
                        hideAll: g
                    } = Hw((0, o.k)(e => ({
                        setEditorBarVisible: e.setEditorBarVisible,
                        setDataPanelVisible: e.setDataPanelVisible,
                        hideAll: e.hideAll
                    }))), {
                        setIsLoading: f
                    } = YC((0, o.k)(e => ({
                        setIsLoading: e.setIsLoading
                    }))), m = e => {
                        e.element && e.part ? (r({
                            part: e.part,
                            element: e.element
                        }), p(!0)) : (r({
                            part: null,
                            element: null
                        }), g())
                    }, y = () => {
                        r({
                            part: null,
                            element: null
                        }), g()
                    };
                    return (0, yy.useEffect)(() => {
                        const e = Cy.V.getInstance(),
                            i = ({
                                globalZoom: e
                            }) => {
                                c(e)
                            },
                            a = () => {
                                g && (d(!!g.editorData.backwardEnable()), h(!!g.editorData.forwardEnable()))
                            },
                            r = () => {},
                            o = () => {
                                f(!1)
                            },
                            l = () => {
                                f(!1)
                            },
                            p = ({
                                state: e,
                                stateInfo: t
                            }) => {
                                null !== e ? .actionMode && e ? .actionMode !== Dt.none || (y(), s({
                                    state: "normal"
                                }))
                            },
                            u = G_.performanceMarkStart(H_.EDITOR_RENDER);
                        let g;
                        return console.time("Edit render time"), Promise.resolve(Sy.getLanguage()).then(async s => {
                            if (g = Gx("chart", "editor", s), g.editorController.addStartHandler(t => {
                                    e.debug("startHandler", t);
                                    try {
                                        t.updateElement()
                                    } catch (e) {
                                        Jv(Yv.UPDATE_ELEMENT, e, s, {
                                            element_id: t.id,
                                            element_type: t.type
                                        })
                                    }
                                    const i = nS(t);
                                    m({
                                        part: i ? ? null,
                                        element: t ? ? null
                                    })
                                }), g.editorController.addRunHandler(() => {
                                    e.debug("runHandler"), y()
                                }), g.editorController.addEndHandler(t => {
                                    if (e.debug("endHandler", t), t && t.id) {
                                        try {
                                            t.updateElement()
                                        } catch (e) {
                                            Jv(Yv.UPDATE_ELEMENT, e, s, {
                                                element_id: t ? .id,
                                                element_type: t ? .type,
                                                element_spec: Fb(t ? .originSpec),
                                                element_part: t ? .part,
                                                element_part_detail: Fb(t ? .partDetail)
                                            })
                                        }
                                        const e = nS(t);
                                        m({
                                            part: e ? ? null,
                                            element: t ? ? null
                                        })
                                    } else y()
                                }), g.editorController.addFinishHandler(() => {
                                    e.debug("finishHandler"), y()
                                }), g.emitter.on(Qe.onLayerWheelStart, i), g.emitter.on(Qe.onLayerWheel, i), g.emitter.on(Qe.historyChange, a), g.emitter.on(Qe.chartDataUpdated, r), g.emitter.on(Qe.dataUpdateFail, o), g.emitter.on(Qe.dataUpdateSuccess, l), g.emitter.on(Qe.onStateChange, p), !await Ux(g, "editor", s)) return Sy.writeData([{
                                type: "replace",
                                data: {
                                    path: ["editorState"],
                                    value: "invalid"
                                }
                            }]), n(!1), void G_.performanceMarkEnd(H_.EDITOR_RENDER, {
                                id: u,
                                detail: {
                                    perf_type: "key_path_perf",
                                    action_name: H_.EDITOR_RENDER,
                                    status: "fail",
                                    editor_mode: "editor"
                                }
                            });
                            n(g), G_.performanceMarkEnd(H_.EDITOR_RENDER, {
                                id: u,
                                detail: {
                                    perf_type: "key_path_perf",
                                    action_name: H_.EDITOR_RENDER,
                                    status: "success",
                                    editor_mode: "editor"
                                }
                            }), Promise.resolve(Sy.readData()).then(e => {
                                if (e.editorState) {
                                    const e = () => {
                                        const t = Math.min(1, Wx(g, 1));
                                        g.zoomTo(t), c(t), g.emitter.off(Qe.afterAllLayerReady, e)
                                    };
                                    if (g.getChartElements().find(e => "wordCloud" === e.vchartType && (0, lt.A)(e.vchart.getSpec().maskShape) || "chart" === e.type && !e.vchartType)) g.emitter.on(Qe.afterAllLayerReady, e);
                                    else {
                                        const e = Math.min(Wx(g, 1), 1);
                                        g.zoomTo(e), c(e)
                                    }
                                } else Sy.writeData([{
                                    type: "replace",
                                    data: {
                                        path: ["editorState"],
                                        value: "initialized"
                                    }
                                }])
                            });
                            const d = y_();
                            t ? .onReady ? .(g, d)
                        }), () => {
                            g && (g.emitter.off(Qe.onLayerWheelStart, i), g.emitter.off(Qe.onLayerWheel, i), g.emitter.off(Qe.historyChange, a), g.emitter.off(Qe.chartDataUpdated, r), g.emitter.off(Qe.dataUpdateFail, o), g.emitter.off(Qe.dataUpdateSuccess, l), g.emitter.off(Qe.onStateChange, p), g.release())
                        }
                    }, []), (0, yy.useEffect)(() => {
                        Sy.onDataChange ? .(async () => {
                            const e = await Sy.getAppVariables(),
                                t = e ? .isMeeting;
                            if (i && t) {
                                const e = await Sy.getContainerRect();
                                await i.loadLasted(e.width, e.height), i.zoomTo(l), i.reLayoutToCenter()
                            }
                        })
                    }, [i, l]), (0, a.jsx)("div", {
                        id: "chart",
                        style: {
                            width: "100%",
                            height: "100vh"
                        }
                    })
                }