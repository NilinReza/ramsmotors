-- Add missing condition field to vehicles table
ALTER TABLE vehicles 
ADD COLUMN condition VARCHAR(50) DEFAULT 'Used';

-- Update existing records to have a default condition
UPDATE vehicles 
SET condition = 'Used' 
WHERE condition IS NULL;

-- Add check constraint for valid condition values
ALTER TABLE vehicles 
ADD CONSTRAINT vehicles_condition_check 
CHECK (condition IN ('New', 'Used', 'Certified Pre-Owned'));
