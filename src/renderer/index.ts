import { definePlugin } from '@citadel-app/sdk';
import { lazy } from 'react';
import pkg from '../../package.json';

export const ExcalidrawModule = definePlugin({
    id: pkg.name,
    version: pkg.version,

    renderer: {
        contentModules: {
            whiteboard: {
                id: 'whiteboard',
                label: 'Whiteboard',
                description: 'Canvas for drawing.',
                requirements: []
            }
        },

        routes: [
            { path: '/whiteboard', component: lazy(() => import('./pages/WhiteboardPage').then(m => ({ default: m.WhiteboardPage }))) }
        ],

        sidebar: [
            {
                id: 'sidebar-whiteboard',
                label: 'The Canvas',
                path: '/whiteboard',
                icon: 'Palette',
                group: 'top',
                priority: 40
            }
        ],

        contentViewers: {
            whiteboard: lazy(() => import('./components/WhiteboardModule').then(m => ({ default: m.WhiteboardModule })))
        },

        externalDataHandlers: [
            {
                type: 'whiteboard',
                frontmatterKey: 'whiteboardId',
                dir: 'board'
            }
        ],

        sectionEditors: {
            whiteboard: lazy(() => import('./components/ExcalidrawEditor').then(m => ({ default: m.ExcalidrawEditor })))
        },

        sectionTemplates: [
            { 
                id: 'whiteboard', 
                label: 'Whiteboard', 
                icon: 'Palette', 
                content: '```excalidraw\n{}\n```',
                pattern: '^```excalidraw'
            }
        ],

        onActivate: async (registrar, api) => {
            // Set up public static assets path dynamically
            const pluginPath = await api.module.invoke('@citadel-app/base', 'plugins.getPluginPath', pkg.name);
            if (pluginPath) {
                (window as any).EXCALIDRAW_ASSET_PATH = `codex://${pluginPath}/public/excalidraw-assets/`;
            } else {
                console.warn(`[Excalidraw] Failed to resolve plugin path for assets. Falling back to relative path.`);
                (window as any).EXCALIDRAW_ASSET_PATH = "/excalidraw-assets/";
            }

            // Settings panel for Excalidraw-specific options
            registrar.registerSettingsPanel({
                id: 'excalidraw',
                title: 'Whiteboard',
                icon: 'Palette',
                component: lazy(() =>
                    import('./components/ExcalidrawSettings').then(m => ({ default: m.ExcalidrawSettingsPanel }))
                ),
                priority: 45
            });
        }
    }
});



// Re-export components for host-level lazy imports if still needed
export { WhiteboardModule } from './components/WhiteboardModule';
export { WhiteboardPage } from './pages/WhiteboardPage';
export { ComponentLibrary } from './components/ComponentLibrary';
