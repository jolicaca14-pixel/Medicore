import pool from '../../../config/database';
import { RoleTemplate, TemplateSection, TemplateField } from '../types';

export class ClinicalConfigService {
    static async getTemplates(): Promise<RoleTemplate[]> {
        const result = await pool.query('SELECT * FROM plantillas_clinicas WHERE activo = true');
        return result.rows.map(row => ({
            id: row.id,
            name: row.nombre,
            description: row.descripcion,
            allowedRoles: row.roles_permitidos,
            recordType: row.tipo_registro,
            sections: row.secciones,
            active: row.activo
        }));
    }

    static async getSections(): Promise<TemplateSection[]> {
        const result = await pool.query('SELECT * FROM secciones_clinicas');
        return result.rows.map(row => ({
            id: row.id,
            title: row.titulo,
            fields: row.campos,
            isDefault: row.es_por_defecto
        }));
    }

    static async getFields(): Promise<TemplateField[]> {
        const result = await pool.query('SELECT * FROM campos_clinicos');
        return result.rows.map(row => ({
            id: row.id,
            label: row.etiqueta,
            type: row.tipo,
            required: row.requerido,
            options: row.opciones,
            unit: row.unidad,
            placeholder: row.placeholder,
            formula: row.formula,
            defaultValue: row.valor_defecto,
            validation: row.validacion
        }));
    }

    static async createTemplate(template: RoleTemplate): Promise<RoleTemplate> {
        const result = await pool.query(
            `INSERT INTO plantillas_clinicas (nombre, descripcion, roles_permitidos, tipo_registro, secciones, activo)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [template.name, template.description, template.allowedRoles, template.recordType, JSON.stringify(template.sections), template.active]
        );
        return result.rows[0];
    }

    static async createSection(section: TemplateSection): Promise<TemplateSection> {
        const result = await pool.query(
            `INSERT INTO secciones_clinicas (id, titulo, campos, es_por_defecto)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [section.id, section.title, JSON.stringify(section.fields), section.isDefault]
        );
        return result.rows[0];
    }

    static async createField(field: TemplateField): Promise<TemplateField> {
        const result = await pool.query(
            `INSERT INTO campos_clinicos (id, etiqueta, tipo, requerido, opciones, unidad, placeholder, formula, valor_defecto, validacion)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [field.id, field.label, field.type, field.required, JSON.stringify(field.options || []), field.unit, field.placeholder, field.formula, JSON.stringify(field.defaultValue), field.validation]
        );
        return result.rows[0];
    }
}
