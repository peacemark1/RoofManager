/**
 * Kilo Code Skill Hub - MCP Server
 * This script scans the /skills folder and exposes instructions and tools to Kilo Code.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SKILLS_DIR = process.argv[2] || path.join(__dirname, '../.kilocode/skills');

// Simple MCP Protocol Implementation
process.stdin.on('data', (data) => {
    const request = JSON.parse(data.toString());

    if (request.method === 'listTools') {
        handleListTools(request);
    } else if (request.method === 'callTool') {
        handleCallTool(request);
    } else if (request.method === 'listResources') {
        handleListResources(request);
    } else if (request.method === 'readResource') {
        handleReadResource(request);
    }
});

function handleListTools(request) {
    const tools = [];
    if (fs.existsSync(SKILLS_DIR)) {
        const skills = fs.readdirSync(SKILLS_DIR);
        skills.forEach(skillName => {
            const skillPath = path.join(SKILLS_DIR, skillName);
            if (fs.statSync(skillPath).isDirectory()) {
                const scripts = fs.readdirSync(skillPath).filter(f => f.endsWith('.js') || f.endsWith('.py'));
                scripts.forEach(script => {
                    tools.push({
                        name: `${skillName}_${path.parse(script).name}`,
                        description: `Runs the ${script} from the ${skillName} skill.`,
                        inputSchema: { type: "object", properties: { args: { type: "array", items: { type: "string" } } } }
                    });
                });
            }
        });
    }

    sendResponse(request.id, { tools });
}

function handleListResources(request) {
    const resources = [];
    if (fs.existsSync(SKILLS_DIR)) {
        const skills = fs.readdirSync(SKILLS_DIR);
        skills.forEach(skillName => {
            const skillPath = path.join(SKILLS_DIR, skillName);
            const skillMd = path.join(skillPath, 'SKILL.md');
            if (fs.existsSync(skillMd)) {
                resources.push({
                    uri: `skill://${skillName}/instructions`,
                    name: `${skillName} Instructions`,
                    mimeType: "text/markdown"
                });
            }
        });
    }
    sendResponse(request.id, { resources });
}

function handleReadResource(request) {
    const uri = request.params.uri;
    const skillName = uri.split('://')[1].split('/')[0];
    const content = fs.readFileSync(path.join(SKILLS_DIR, skillName, 'SKILL.md'), 'utf-8');
    sendResponse(request.id, { contents: [{ uri, text: content }] });
}

async function handleCallTool(request) {
    const [skillName, scriptName] = request.params.name.split('_');
    const args = request.params.arguments?.args || [];

    const skillPath = path.join(SKILLS_DIR, skillName);
    const scriptFile = fs.readdirSync(skillPath).find(f => f.startsWith(scriptName));
    const fullPath = path.join(skillPath, scriptFile);

    const cmd = scriptFile.endsWith('.js') ? 'node' : 'python';
    const proc = spawn(cmd, [fullPath, ...args]);

    let output = '';
    proc.stdout.on('data', (data) => output += data);
    proc.stderr.on('data', (data) => output += data);

    proc.on('close', (code) => {
        sendResponse(request.id, { content: [{ type: "text", text: output }] });
    });
}

function sendResponse(id, result) {
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + '\n');
}
