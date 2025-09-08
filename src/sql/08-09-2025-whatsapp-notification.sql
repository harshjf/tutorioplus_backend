CREATE TABLE IF NOT EXISTS whatsapp_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,         
    template_name VARCHAR(255) NOT NULL,       
    language VARCHAR(16) NOT NULL DEFAULT 'en',
    from_number VARCHAR(32),                   
    variable_order jsonb NOT NULL DEFAULT '[]'::jsonb, 
    components jsonb,                          
    created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE notification_channel_mapping
ADD COLUMN IF NOT EXISTS whatsapp_template_id BIGINT REFERENCES whatsapp_templates(id);

INSERT INTO whatsapp_templates (name, template_name, language, from_number, variable_order)
VALUES ('ONBOARDING_WHATSAPP', 'chatbot_no_1_all_in_one_final_august', 'en', '917891218079', '[]'::jsonb)
ON CONFLICT (name) DO NOTHING;

INSERT INTO notification_channel_mapping (notification_id, channel_id, template_id, whatsapp_template_id)
SELECT 
	n.id,
	c.id,
	NULL,
	w.id
FROM notifications n
JOIN whatsapp_templates w ON w.name = 'ONBOARDING_WHATSAPP'
JOIN notification_channels c ON c.name = 'WHATSAPP'
WHERE n.name = 'ONBOARDING'
ON CONFLICT DO NOTHING;
