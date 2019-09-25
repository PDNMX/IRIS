export default {
    time: {
        fields: {
            datetime: {
                type: 'datetime'
            },
            title: {
                type: 'string'
            },
            subTitle: {
                type: 'string'
            },
        },
        props: {
            mode: 'left'
        }
    },
    sheet: {
        fields: {
            columns: {
                type: 'array'
            }
        }
    },
    description: {
        fields: {
            columns: {
                type: 'array'
            }
        }
    },
    lines: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        },
        config: {
            analytic: {
                type: 'categorical',
                label: 'Analítico',
                values: ['avg', 'min', 'max']
            },
            formula: {
                type: 'string',
                label: 'Fórmula'
            },
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            },
            scale: {
                type: 'categorical',
                label: 'Escala',
                values: ['linear', 'log']
            },
            cumulative: {
                type: 'categorical',
                label: 'Acumulativa',
                values: ['lt', 'lte', 'gt', 'gte']
            }
        }
    },
    stackArea: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        },
        config: {
            analytic: {
                type: 'categorical',
                label: 'Analítico',
                values: ['avg', 'min', 'max']
            },
            formula: {
                type: 'string',
                label: 'Fórmula'
            },
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            },
            scale: {
                type: 'categorical',
                label: 'Escala',
                values: ['linear', 'log']
            },
            cumulative: {
                type: 'categorical',
                label: 'Acumulativa',
                values: ['lt', 'lte', 'gt', 'gte']
            }
        }
    },
    linesAndPoints: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        },
        config: {
            analytic: {
                type: 'categorical',
                label: 'Analítico',
                values: ['avg', 'min', 'max']
            },
            formula: {
                type: 'string',
                label: 'Fórmula'
            },
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            },
            scale: {
                type: 'categorical',
                label: 'Escala',
                values: ['linear', 'log']
            },
            cumulative: {
                type: 'categorical',
                label: 'Acumulativa',
                values: ['lt', 'lte', 'gt', 'gte']
            }
        }
    },
    area: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        },
        config: {
            analytic: {
                type: 'categorical',
                label: 'Analítico',
                values: ['avg', 'min', 'max']
            },
            formula: {
                type: 'string',
                label: 'Fórmula'
            },
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            },
            scale: {
                type: 'categorical',
                label: 'Escala',
                values: ['linear', 'log']
            },
            cumulative: {
                type: 'categorical',
                label: 'Acumulativa',
                values: ['lt', 'lte', 'gt', 'gte']
            }
        }
    },
    bars: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        },
        config: {
            analytic: {
                type: 'categorical',
                label: 'Analítico',
                values: ['avg', 'min', 'max']
            },
            formula: {
                type: 'string',
                label: 'Fórmula'
            },
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            },
            scale: {
                type: 'categorical',
                label: 'Escala',
                values: ['linear', 'log']
            },
            cumulative: {
                type: 'categorical',
                label: 'Acumulativa',
                values: ['lt', 'lte', 'gt', 'gte']
            }
        }
    },
    doubleAxis: {
        fields: {
            axis: {
                type: 'numeric',
            },
            bars: {
                type: 'numeric'
            },
            lines: {
                type: 'numeric'
            }
        },
        config: {
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            },
            scaleType: {
                type: 'categorical',
                label: 'Tippo de escala',
                values: ['individual', 'shared']
            }
        }
    },
    stackBar: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        },
        config: {
            density: {
                type: 'categorical',
                label: 'Densidad',
                values: [0, 0.25, 0.5, 0.75, 1]
            }
        }
    },
    points: {
        fields: {
            axis: {
                type: 'numeric',
            },
            values: {
                type: 'array'
            },
            color: {
                type: 'string'
            }
        }
    },
    pie: {
        fields: {
            details: {
                type: 'string'
            },
            values: {
                type: 'numeric'
            }
        }
    },
    radar: {
        fields: {
            axis: {
                type: 'string',
            },
            values: {
                type: 'numeric'
            },
            color: {
                type: 'string'
            }
        }
    },
    statistic: {
        fields: {
            variable: {
                type: 'numeric'
            }
        },
        constants: {
            prefix: {
                type: 'string'
            },
            suffix: {
                type: 'string'
            }
        },
        config: {
            title: false
        }
    },
    mapScatterPlot: {
        fields: {
            id: {
                type: 'string'
            },
            latitude: {
                type: 'numeric'
            },
            longitude: {
                type: 'numeric'
            },
            color: {
                type: 'numeric'
            },
            radius: {
                type: 'numeric'
            }
        }
    },
    heatMap: {
        fields: {
            latitude: {
                type: 'numeric'
            },
            longitude: {
                type: 'numeric'
            },
            weight: {
                type: 'numeric'
            }
        }
    },
    iconLayer: {
        fields: {
            latitude: {
                type: 'numeric'
            },
            longitude: {
                type: 'numeric'
            }
        }
    }
}