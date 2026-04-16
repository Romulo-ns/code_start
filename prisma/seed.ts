import { prisma } from "@/lib/prisma";
import { Difficulty } from "@prisma/client";

const challenges = [
  {
    title: "Soma de Dois Números",
    slug: "soma-de-dois-numeros",
    description: `Crie uma função chamada \`solution\` que receba dois números e retorne a soma deles.

**Exemplo:**
\`\`\`
solution(2, 3) → 5
solution(10, 20) → 30
solution(-5, 5) → 0
\`\`\`

Este é o desafio mais básico de programação. Você vai aprender a criar funções e trabalhar com operadores aritméticos.`,
    difficulty: Difficulty.EASY,
    points: 10,
    hints: [
      "Use a palavra-chave 'function' para criar uma função",
      "O operador '+' serve para somar números",
      "Lembre de usar 'return' para retornar o resultado",
    ],
    solution: `function solution(a, b) {
  return a + b;
}`,
    explanation: `## Como funciona

Para resolver este desafio, criamos uma função chamada \`solution\` que aceita dois parâmetros (\`a\` e \`b\`) e retorna a soma usando o operador \`+\`.

\`\`\`javascript
function solution(a, b) {
  return a + b;
}
\`\`\`

**Conceitos aprendidos:**
- **Funções**: blocos de código reutilizáveis
- **Parâmetros**: valores que passamos para a função
- **return**: palavra-chave para devolver um valor
- **Operador +**: usado para somar números`,
    tags: ["funções", "matemática", "iniciante"],
    testCases: [
      { input: "2, 3", expected: "5", isHidden: false },
      { input: "10, 20", expected: "30", isHidden: false },
      { input: "-5, 5", expected: "0", isHidden: false },
      { input: "0, 0", expected: "0", isHidden: true },
      { input: "100, 200", expected: "300", isHidden: true },
    ],
  },
  {
    title: "Número Par ou Ímpar",
    slug: "par-ou-impar",
    description: `Crie uma função chamada \`solution\` que receba um número e retorne \`"par"\` se for par ou \`"impar"\` se for ímpar.

**Exemplo:**
\`\`\`
solution(4) → "par"
solution(7) → "impar"
solution(0) → "par"
\`\`\`

Dica: Um número é par quando o resto da divisão por 2 é zero.`,
    difficulty: Difficulty.EASY,
    points: 10,
    hints: [
      "Use o operador % (módulo) para obter o resto da divisão",
      "Se número % 2 === 0, o número é par",
      "Use if/else para retornar os valores corretos",
    ],
    solution: `function solution(n) {
  if (n % 2 === 0) {
    return "par";
  } else {
    return "impar";
  }
}`,
    explanation: `## Como funciona

Usamos o operador **módulo (%)**  para verificar se um número é divisível por 2.

\`\`\`javascript
function solution(n) {
  if (n % 2 === 0) {
    return "par";
  } else {
    return "impar";
  }
}
\`\`\`

**Conceitos aprendidos:**
- **Operador %**: retorna o resto da divisão
- **if/else**: estrutura de decisão
- **Comparação ===**: verifica igualdade estrita`,
    tags: ["condicionais", "matemática", "iniciante"],
    testCases: [
      { input: "4", expected: '"par"', isHidden: false },
      { input: "7", expected: '"impar"', isHidden: false },
      { input: "0", expected: '"par"', isHidden: false },
      { input: "1", expected: '"impar"', isHidden: true },
      { input: "100", expected: '"par"', isHidden: true },
    ],
  },
  {
    title: "FizzBuzz",
    slug: "fizzbuzz",
    description: `Crie uma função chamada \`solution\` que receba um número e:
- Retorne \`"Fizz"\` se divisível por 3
- Retorne \`"Buzz"\` se divisível por 5
- Retorne \`"FizzBuzz"\` se divisível por ambos
- Retorne o próprio número caso contrário

**Exemplo:**
\`\`\`
solution(3) → "Fizz"
solution(5) → "Buzz"
solution(15) → "FizzBuzz"
solution(7) → 7
\`\`\`

Este é um dos desafios mais famosos de programação!`,
    difficulty: Difficulty.EASY,
    points: 15,
    hints: [
      "Verifique divisibilidade por ambos (3 e 5) primeiro",
      "Use o operador % para verificar divisibilidade",
      "A ordem dos if/else importa!",
    ],
    solution: `function solution(n) {
  if (n % 3 === 0 && n % 5 === 0) {
    return "FizzBuzz";
  } else if (n % 3 === 0) {
    return "Fizz";
  } else if (n % 5 === 0) {
    return "Buzz";
  } else {
    return n;
  }
}`,
    explanation: `## Como funciona

A chave é verificar \`FizzBuzz\` (divisível por 15) **antes** de checar Fizz e Buzz individualmente.

\`\`\`javascript
function solution(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n;
}
\`\`\`

**Conceitos aprendidos:**
- **Operador &&**: "e" lógico
- **Múltiplas condições**: usando if/else if/else
- **Ordem de verificação**: lógica sequencial`,
    tags: ["condicionais", "lógica", "clássico"],
    testCases: [
      { input: "3", expected: '"Fizz"', isHidden: false },
      { input: "5", expected: '"Buzz"', isHidden: false },
      { input: "15", expected: '"FizzBuzz"', isHidden: false },
      { input: "7", expected: "7", isHidden: false },
      { input: "30", expected: '"FizzBuzz"', isHidden: true },
      { input: "9", expected: '"Fizz"', isHidden: true },
    ],
  },
  {
    title: "Reverter uma String",
    slug: "reverter-string",
    description: `Crie uma função chamada \`solution\` que receba uma string e retorne ela ao contrário.

**Exemplo:**
\`\`\`
solution("hello") → "olleh"
solution("JavaScript") → "tpircSavaJ"
solution("abc") → "cba"
\`\`\``,
    difficulty: Difficulty.MEDIUM,
    points: 20,
    hints: [
      "Strings em JS têm o método .split() para transformar em array",
      "Arrays têm o método .reverse() para inverter",
      "Use .join() para unir o array de volta em string",
    ],
    solution: `function solution(str) {
  return str.split("").reverse().join("");
}`,
    explanation: `## Como funciona

Utilizamos três métodos encadeados:

\`\`\`javascript
function solution(str) {
  return str.split("").reverse().join("");
}
\`\`\`

1. **split("")**: converte a string em array de caracteres
2. **reverse()**: inverte o array
3. **join("")**: une o array de volta em string

**Conceitos aprendidos:**
- **Métodos de string**: split, join
- **Métodos de array**: reverse
- **Method chaining**: encadear métodos`,
    tags: ["strings", "arrays", "métodos"],
    testCases: [
      { input: '"hello"', expected: '"olleh"', isHidden: false },
      { input: '"JavaScript"', expected: '"tpircSavaJ"', isHidden: false },
      { input: '"abc"', expected: '"cba"', isHidden: false },
      { input: '""', expected: '""', isHidden: true },
      { input: '"a"', expected: '"a"', isHidden: true },
    ],
  },
  {
    title: "Palíndromo",
    slug: "palindromo",
    description: `Crie uma função chamada \`solution\` que retorne \`true\` se a string for um palíndromo (igual lida de frente e de trás) ou \`false\` caso contrário.

**Exemplo:**
\`\`\`
solution("racecar") → true
solution("hello") → false
solution("madam") → true
\`\`\`

Ignore maiúsculas/minúsculas na comparação.`,
    difficulty: Difficulty.MEDIUM,
    points: 25,
    hints: [
      "Converta a string para minúsculas com .toLowerCase()",
      "Reverta a string e compare com o original",
      "Use o desafio anterior de reverter string como base!",
    ],
    solution: `function solution(str) {
  const lower = str.toLowerCase();
  const reversed = lower.split("").reverse().join("");
  return lower === reversed;
}`,
    explanation: `## Como funciona

Comparamos a string original (em minúsculas) com sua versão revertida:

\`\`\`javascript
function solution(str) {
  const lower = str.toLowerCase();
  const reversed = lower.split("").reverse().join("");
  return lower === reversed;
}
\`\`\`

**Conceitos aprendidos:**
- **toLowerCase()**: normalizar strings
- **Comparação de strings**: operador ===
- **Reutilização de lógica**: usar conhecimento de desafios anteriores`,
    tags: ["strings", "lógica", "intermediário"],
    testCases: [
      { input: '"racecar"', expected: "true", isHidden: false },
      { input: '"hello"', expected: "false", isHidden: false },
      { input: '"Madam"', expected: "true", isHidden: false },
      { input: '"a"', expected: "true", isHidden: true },
      { input: '"abba"', expected: "true", isHidden: true },
    ],
  },
  {
    title: "Fibonacci",
    slug: "fibonacci",
    description: `Crie uma função chamada \`solution\` que receba um número \`n\` e retorne o n-ésimo número da sequência de Fibonacci.

A sequência começa: 0, 1, 1, 2, 3, 5, 8, 13, 21, ...

**Exemplo:**
\`\`\`
solution(0) → 0
solution(1) → 1
solution(6) → 8
solution(10) → 55
\`\`\``,
    difficulty: Difficulty.HARD,
    points: 40,
    hints: [
      "Fibonacci(0) = 0, Fibonacci(1) = 1",
      "Cada número é a soma dos dois anteriores",
      "Use um loop for com duas variáveis para os valores anteriores",
    ],
    solution: `function solution(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}`,
    explanation: `## Como funciona

Usamos programação iterativa para calcular Fibonacci eficientemente:

\`\`\`javascript
function solution(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    let next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}
\`\`\`

**Conceitos aprendidos:**
- **Casos base**: tratar valores especiais primeiro
- **Loop for**: repetição de código
- **Variáveis temporárias**: para manter estado
- **Eficiência**: solução O(n) vs recursão O(2^n)`,
    tags: ["algoritmos", "loops", "avançado"],
    testCases: [
      { input: "0", expected: "0", isHidden: false },
      { input: "1", expected: "1", isHidden: false },
      { input: "6", expected: "8", isHidden: false },
      { input: "10", expected: "55", isHidden: true },
      { input: "15", expected: "610", isHidden: true },
    ],
  },
];

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Clean existing data
  await prisma.submission.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.challenge.deleteMany();

  for (const challenge of challenges) {
    const { testCases, ...challengeData } = challenge;
    const created = await prisma.challenge.create({
      data: {
        ...challengeData,
        testCases: {
          create: testCases,
        },
      },
    });
    console.log(`✅ Desafio criado: ${created.title}`);
  }

  console.log("🎉 Seed completo!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
