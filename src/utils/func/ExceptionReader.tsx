
import * as acorn from "acorn";
import * as walk from "acorn-walk";

export function ExceptionReader(code: string): string | null {
    try {
        const ast = acorn.parse(code, {
            ecmaVersion: "latest",
        });

        let error: string | null = null;

        

        walk.simple(ast as any, {
            WhileStatement(node: any) {
                if (node.test.type === "Literal" && node.test.value) {
                    error = "❌ Бесконечный цикл while(true)";
                }
            },

            ForStatement(node: any) {
                if (!node.test) {
                    error = "❌ Бесконечный цикл for(;;)";
                }
            },

            CallExpression(node: any) {
                if (node.callee.name === "eval") {
                    error = "❌ eval запрещён";
                }

                if (node.callee.name === "Function") {
                    error = "❌ new Function запрещён";
                }
            },

            MemberExpression(node: any) {
                const prop = node.property?.name;

                if (prop === "innerHTML") {
                    error = "❌ innerHTML запрещён";
                }

                if (
                    node.object?.name === "window" &&
                    prop === "parent"
                ) {
                    error = "❌ доступ к window.parent запрещён";
                }
            },
        });

        return error;
    } catch (err: any) {
        return "❌ Ошибка парсинга JS";
    }
}