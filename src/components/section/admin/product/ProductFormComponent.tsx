'use client';

import style from '@/styles/admin/ProductForm.module.scss';
import { useState, DragEvent, ChangeEvent } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import Input from '@/components/system/Input';
import MaterialIcon from '@/components/system/MaterialIcon';
import { createProduct, updateProduct } from '@/requests/products.request';
import { useFeedback } from '@/hooks/FeedbackHook';
import {
  IProduct,
  ProductCategoryOptions,
  transKey,
} from '@/types/product.types';
import { useError } from '@/hooks/ErrorHook';
import { FormContainer, FormRow } from '@/components/system/Form';
import Select from '@/components/system/Select';
import Button, { ButtonContainer } from '@/components/system/Button';
import { Logger } from '@/utils/Logger.class';
import Checkbox from '@/components/system/Checkbox';

interface ProductFormProps {
  onClose: () => void;
  product?: IProduct;
}

interface FormField {
  name: transKey;
  description: transKey;
  price: number;
  stockQuantity: number;
  category: ProductCategoryOptions | string;
  isActive: boolean;
}

const CATEGORIES = [
  'Tampers',
  'Milk Jugs',
  'Tools',
  'Coffee Cups',
  'Scales',
  'Cleaning Tools',
];

const validatePrice = (price: number | undefined) => {
  if (!price) return 'required';
  return price > 0 || 'required'; // Todo: change to something sinvolles..
};

const validateStock = (stock: number | undefined) => {
  if (stock === undefined) return 'Lagerbestand ist erforderlich';
  return stock >= 0 || 'Lagerbestand kann nicht negativ sein';
};

const ProductForm = ({ onClose, product }: ProductFormProps) => {
  const { showFeedback } = useFeedback();
  const { transformFieldError } = useError();
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    product?.imageUrl,
  );
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isLoading, isDirty, isValid },
  } = useForm<FormField>({
    defaultValues: {
      name: {
        inv: product?.name?.inv || '',
        de: product?.name?.de,
        fr: product?.name?.fr,
        en: product?.name?.en,
      },

      description: {
        inv: product?.description?.inv || '',
        de: product?.description?.de,
        fr: product?.description?.fr,
        en: product?.description?.en,
      },
      price: product?.price || 0,
      stockQuantity: product?.stockQuantity || 0,
      category: product?.category || '',
      isActive: product?.isActive ?? true,
    },
    mode: 'onChange',
  });

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(undefined);
  };

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    try {
      const productData = {
        name: {
          inv: data?.name?.de || data?.name?.fr || data?.name?.en || '',
          de: data?.name?.de,
          fr: data?.name?.fr,
          en: data?.name?.en,
        },
        description: {
          inv:
            data?.description?.de ||
            data?.description?.fr ||
            data?.description?.en ||
            '',
          de: data?.description?.de,
          fr: data?.description?.fr,
          en: data?.description?.en,
        },
        price: data.price,
        stockQuantity: data.stockQuantity,
        category: data.category,
        isActive: data.isActive,
      };

      if (product?._id) {
        await updateProduct(product._id, productData, imageFile || undefined);
        showFeedback(t('feedback.product-updated-success'), 'success');
      } else {
        await createProduct(productData, imageFile || undefined);
        showFeedback(t('feedback.product-created-success'), 'success');
      }
      onClose();
    } catch (error: any) {
      Logger.error('Operation failed:', error);
      showFeedback(t('feedback.operation-error'), 'error');
    }
  };

  return (
    <div className={style.productForm}>
      <div className={style.formHeader}>
        <h2>{product ? 'Artikel bearbeiten' : 'Neuen Artikel anlegen'}</h2>
        <Button
          appearance={'icon'}
          icon={'close'}
          variant={'ghost'}
          onClick={onClose}
          disabled={isLoading}
        />
      </div>

      <FormContainer
        className={style.formContainer}
        onSubmitAction={handleSubmit(onSubmit)}
      >
        <FormRow>
          <div className={style.imageUploadSection}>
            <label className={style.sectionLabel}>Produktbild</label>
            <div
              className={`${style.dropZone} ${isDragging ? style.dragging : ''} ${imagePreview ? style.hasImage : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className={style.imagePreviewContainer}>
                  <Image
                    src={imagePreview}
                    alt="Vorschau"
                    className={style.imagePreview}
                    width={200}
                    height={200}
                  />
                  <Button
                    type="button"
                    appearance={'icon'}
                    variant={'ghost'}
                    icon={'delete'}
                    onClick={removeImage}
                    className={style.removeImageButton}
                  />
                </div>
              ) : (
                <div className={style.dropZoneContent}>
                  <MaterialIcon icon="cloud_upload" iconSize="normal" />
                  <p className={style.dropZoneText}>
                    Ziehen Sie ein Bild hierher oder klicken Sie zum Auswählen
                  </p>
                  <p className={style.dropZoneHint}>
                    JPG, PNG, WebP • Max. 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className={style.fileInput}
                disabled={isLoading}
              />
            </div>
          </div>
        </FormRow>
        <FormRow>
          <Input
            label="Artikelname auf Englisch"
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('name.en', {
              required: 'required',
              minLength: { value: 3, message: 'minLength' },
              maxLength: { value: 126, message: 'minLength' },
            })}
            {...transformFieldError(errors?.name?.en)}
          />
        </FormRow>
        <FormRow>
          <Input
            label="Artikelname auf Deutsch"
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('name.de', {
              required: 'required',
              minLength: { value: 3, message: 'minLength' },
              maxLength: { value: 126, message: 'minLength' },
            })}
            {...transformFieldError(errors?.name?.de)}
          />
        </FormRow>{' '}
        <FormRow>
          <Input
            label="Artikelname  auf Französisch"
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('name.fr', {
              required: 'required',
              minLength: { value: 3, message: 'minLength' },
              maxLength: { value: 126, message: 'minLength' },
            })}
            {...transformFieldError(errors?.name?.fr)}
          />
        </FormRow>
        <FormRow>
          <Input
            label="Beschreibung  auf Englisch"
            required
            fullWidth
            multiline
            minRows={4}
            readOnly={isLoading}
            inputProps={register('description.en', {
              required: 'required',
              minLength: { value: 10, message: 'minLength' },
            })}
            {...transformFieldError(errors?.description?.en)}
          />
        </FormRow>{' '}
        <FormRow>
          <Input
            label="Beschreibung  auf Deutsch"
            required
            fullWidth
            multiline
            minRows={4}
            readOnly={isLoading}
            inputProps={register('description.de', {
              required: 'required',
              minLength: { value: 10, message: 'minLength' },
            })}
            {...transformFieldError(errors?.description?.de)}
          />
        </FormRow>{' '}
        <FormRow>
          <Input
            label="Beschreibung  auf Französisch"
            required
            fullWidth
            multiline
            minRows={4}
            readOnly={isLoading}
            inputProps={register('description.fr', {
              required: 'required',
              minLength: { value: 10, message: 'minLength' },
            })}
            {...transformFieldError(errors?.description?.fr)}
          />
        </FormRow>
        <FormRow direction="row">
          <Input
            type="number"
            label="Preis (CHF)"
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('price', {
              required: 'required',
              validate: validatePrice,
            })}
            {...transformFieldError(errors.price)}
          />

          <Input
            type="number"
            label="Lagerbestand"
            required
            fullWidth
            readOnly={isLoading}
            inputProps={register('stockQuantity', {
              required: 'required',
              valueAsNumber: true,
              validate: validateStock,
            })}
            {...transformFieldError(errors.stockQuantity)}
          />
        </FormRow>
        <FormRow>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                name={field.name}
                value={field.value || ''}
                onChange={(event) => field.onChange(event.target.value)}
                onBlur={field.onBlur}
                options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                label="Kategorie"
                error={!!errors.category}
                required
                fullWidth
              />
            )}
          />
        </FormRow>
        <FormRow>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                label={'Article is Active'}
                checked={field.value}
                onChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
        </FormRow>
        <ButtonContainer>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Abbrechen
          </Button>

          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || !isDirty || !isValid}
          >
            <>
              <MaterialIcon icon="save" iconSize="small" />
              {product ? 'Artikel aktualisieren' : 'Artikel anlegen'}
            </>
          </Button>
        </ButtonContainer>
      </FormContainer>
    </div>
  );
};

export default ProductForm;
